import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { getSession } from "next-auth/client";
import { RichText } from "prismic-dom";
import { getPrismicClient } from "../../services/prismic";

import styles from "./post.module.scss";

type Post = {
  slug: string;
  title: string;
  content: string;
  updated_at: string;
};

type PostProps = {
  post: Post;
};

const Post: NextPage<PostProps> = ({ post }) => {
  return (
    <>
      <Head>
        <title>{post.title} | ig.news</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updated_at}</time>
          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
  );
};

export default Post;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = await getSession({ req });
  const { slug } = params as { slug: string | string[] };

  if (!session?.activeSubscription)
    return {
      redirect: {
        destination: `/posts/preview/${slug}`,
        permanent: false,
      },
    };

  const prismic = getPrismicClient(req);
  const response = await prismic.getByUID<any>("post", String(slug), {});

  const post = {
    slug: slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updated_at: new Date(
      response.last_publication_date ?? ""
    ).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
  };

  return {
    props: { post },
  };
};
