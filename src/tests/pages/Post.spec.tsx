import { render, screen, waitFor } from "@testing-library/react";
import { getSession } from "next-auth/client";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { getPrismicClient } from "../../services/prismic";

jest.mock("next-auth/client");
jest.mock("../../services/prismic");

describe("Post page", () => {
  it("renders correctly", () => {
    render(
      <Post
        post={{
          content: "<p>fake-content</p>",
          title: "fake-title",
          slug: "fake-slug",
          updated_at: "26 de outubro de 2022",
        }}
      />
    );

    expect(screen.getByText("fake-title")).toBeInTheDocument();
    expect(screen.getByText("fake-content")).toBeInTheDocument();
  });

  it("redirects to preview if user hasn't an active subscription", async () => {
    const getSessionMocked = jest.mocked(getSession);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: null,
    });

    const serverSidePropsResponse = await getServerSideProps({
      params: { slug: "fake-slug" },
    } as any);

    expect(serverSidePropsResponse).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: `/posts/preview/fake-slug`,
        }),
      })
    );
  });

  it("loads initial data if user has an active subscription", async () => {
    const getSessionMocked = jest.mocked(getSession);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: "fake-session",
    });

    const getPrismicClientMocked = jest.mocked(getPrismicClient);

    const getByUIDMocked = jest.fn().mockResolvedValueOnce({
      data: {
        title: [{ type: "heading", text: "fake-title" }],
        content: [
          { type: "paragraph", text: "fake-content-1" },
          { type: "paragraph", text: "fake-content-2" },
        ],
      },
      last_publication_date: "2022-10-26 00:00:00",
    });

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: getByUIDMocked,
    } as any);

    const serverSidePropsResponse = await getServerSideProps({
      params: { slug: "fake-slug" },
    } as any);

    expect(getByUIDMocked).toHaveBeenCalledWith("post", "fake-slug", {});
    expect(serverSidePropsResponse).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "fake-slug",
            title: "fake-title",
            content: "<p>fake-content-1</p><p>fake-content-2</p>",
            updated_at: "26 de outubro de 2022",
          },
        },
      })
    );
  });
});
