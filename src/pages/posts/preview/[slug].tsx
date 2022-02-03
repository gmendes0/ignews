import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import Link from "next/link";
import { RichText } from "prismic-dom";
import { useEffect } from "react";
import { getPrismicClient } from "../../../services/prismic";

import styles from "../post.module.scss";

type Post = {
  title: string;
  updated_at: string;
  content: string;
  slug: string;
};

type PreviewProps = {
  post: Post;
};

const Preview: NextPage<PreviewProps> = ({ post }) => {
  const [session, loading] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.activeSubscription) router.push(`/posts/${post.slug}`);
  }, [session]);

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
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
};

export default Preview;

/*
 * Deve retornar quais paths dever ser gerados durante a build
 */
export const getStaticPaths: GetStaticPaths = async () => {
  // return {
  //   paths: [{ params: { slug: "-introducao" } }],
  //   fallback: "blocking",
  // };

  return {
    paths: [{ params: { slug: "-introducao" } }],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string | string[] };

  const prismic = getPrismicClient();
  const response = await prismic.getByUID<any>("post", String(slug), {});

  const post = {
    slug: slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
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
    revalidate: 60 * 60, // 1 hour
  };
};
