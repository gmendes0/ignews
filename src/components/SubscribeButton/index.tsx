import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";

export function SubscribeButton() {
  const [session, loading] = useSession();
  const router = useRouter();

  async function handleSubscribe() {
    if (!session) {
      signIn("github");
      return;
    }

    if (session.activeSubscription) {
      router.push("/posts");

      return;
    }

    try {
      const response = await api.post<{ sessionId: string }>(
        "/stripe/sessions/create"
      );

      const { sessionId } = response.data;

      const stripeJS = await getStripeJs();

      await stripeJS?.redirectToCheckout({ sessionId });
    } catch (err) {
      alert("Failed to process checkout");
      console.error(err);
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
