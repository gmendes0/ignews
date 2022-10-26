import ApiSearchResponse from "@prismicio/client/types/ApiSearchResponse";
import { render, screen } from "@testing-library/react";
import Posts, { getStaticProps } from "../../pages/posts";
import { getPrismicClient } from "../../services/prismic";

jest.mock("../../services/prismic");

describe("Posts page", () => {
  it("renders correctly", () => {
    const posts = [
      {
        slug: "fake-slug",
        title: "fake-title",
        excerpt: "fake-excerpt",
        updated_at: "fake-updated-at",
      },
    ];

    render(<Posts posts={posts} />);

    expect(screen.getByText(posts[0].title)).toBeInTheDocument();
  });

  it("loads initial data", async () => {
    const postDocument = {
      uid: "fake-id",
      data: {
        title: [{ type: "heading", text: "fake-title" }],
        content: [{ type: "paragraph", text: "fake-text" }],
      },
      last_publication_date: "2022-09-24 00:00:00",
    };

    const getPrismicClientMocked = jest.mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [postDocument],
      }),
    } as any);

    const staticPropsResponse = await getStaticProps({});

    expect(staticPropsResponse).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: postDocument.uid,
              title: "fake-title",
              excerpt: "fake-text",
              updated_at: "24 de setembro de 2022",
            },
          ],
        },
      })
    );
  });
});
