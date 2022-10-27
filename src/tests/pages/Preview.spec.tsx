import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import Preview, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { getPrismicClient } from "../../services/prismic";

const post = {
  title: "fake-title",
  updated_at: "26 de outubro de 2022",
  content: "<p>fake-content</p>",
  slug: "fake-slug",
};

jest.mock("next-auth/client");
jest.mock("next/dist/client/router");
jest.mock("../../services/prismic");

describe("Preview page", () => {
  it("renders correctly when user has not an active subscription", () => {
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false] as any);

    const useRouterMock = jest.mocked(useRouter);

    const pushMocked = jest.fn();

    useRouterMock.mockReturnValueOnce({
      push: pushMocked,
    } as any);

    render(<Preview post={post} />);

    // Playground URL - é útil para debug/pegar dicas de como selecionar elementos
    // screen.logTestingPlaygroundURL();

    expect(screen.getByText("fake-title")).toBeInTheDocument();
    expect(screen.getByText("fake-content")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /subscribe now/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /subscribe now/i })
    ).toHaveAttribute("href", "/");
    expect(pushMocked).not.toHaveBeenCalled();
  });

  it("redirects to post page when user has an active subscription", () => {
    const useRouterMocked = jest.mocked(useRouter);
    const pushMocked = jest.fn();

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked,
    } as any);

    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValueOnce([
      { activeSubscription: "active-subscription" },
      false,
    ] as any);

    render(<Preview post={post} />);

    expect(pushMocked).toHaveBeenCalledWith(`/posts/${post.slug}`);
  });

  it("loads initial data", async () => {
    const getPrismicClientMocked = jest.mocked(getPrismicClient);
    const getByUIDMocked = jest.fn().mockResolvedValueOnce({
      data: {
        title: [{ type: "heading", text: "fake-title" }],
        content: [
          { type: "paragraph", text: "fake-text-1" },
          { type: "paragraph", text: "fake-text-2" },
          { type: "paragraph", text: "fake-text-3" },
          { type: "paragraph", text: "fake-text-4" },
        ],
      },
      last_publication_date: "2022-10-26 00:00:00",
    });

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: getByUIDMocked,
    } as any);

    const staticPropsResponse = await getStaticProps({
      params: { slug: post.slug },
    });

    expect(staticPropsResponse).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: post.slug,
            title: "fake-title",
            content: "<p>fake-text-1</p><p>fake-text-2</p><p>fake-text-3</p>",
            updated_at: "26 de outubro de 2022",
          },
        },
      })
    );
  });
});
