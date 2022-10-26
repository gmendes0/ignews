import type { GetServerSideProps, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";

import styles from "../styles/home.module.scss";
import { price as priceFormat } from "../utils/number";

type HomeProps = {
  product: {
    priceID: string;
    amount: string;
  };
};

const Home: NextPage<HomeProps> = ({ product }) => {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>

        <meta name="description" content="News about the React world" />
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👋 Hey, welcome</span>
          <h1>
            News about the <span>React</span> world
          </h1>
          <p>
            Get access to all the publications
            <span>
              <br /> for {product.amount} month
            </span>
          </p>

          <SubscribeButton />
        </section>

        <img src="/images/avatar.svg" alt="girl coding" />
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve(process.env.STRIPE_PRICE_ID || ""); // É possível passar {expand: ['product']} no segundo parametro para pegar os dados do produto também

  const product = {
    priceID: price.id,
    amount: priceFormat((price?.unit_amount ?? NaN) / 100), // Stripe retorna o preço em centavos
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};

export default Home;
