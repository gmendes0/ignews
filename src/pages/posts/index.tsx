import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Prismic from "@prismicio/client";
import { getPrismicClient } from "../../services/prismic";
import styles from "./styles.module.scss";
import { RichText } from "prismic-dom";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updated_at: string;
};

type PostsProps = {
  posts: Post[];
};

const Posts: NextPage<PostsProps> = ({ posts }) => {
  return (
    <>
      <Head>
        <title>Posts | ig.news</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <a>
                <time>{post.updated_at}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
};

export default Posts;

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query<any>(
    [Prismic.predicates.at("document.type", "post")],
    {
      fetch: ["post.title", "post.content"],
      pageSize: 100,
    }
  );

  const posts = response.results.map((post) => ({
    slug: post.uid,
    title: RichText.asText(post.data.title),
    excerpt:
      post.data.content.find((content: any) => content.type === "paragraph")
        ?.text ?? "",
    updated_at: new Date(post.last_publication_date ?? "").toLocaleDateString(
      "pt-BR",
      { day: "2-digit", month: "long", year: "numeric" }
    ),
  }));

  return {
    props: { posts },
  };
};
