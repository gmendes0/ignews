import { signIn, useSession } from "next-auth/client";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";

type SubscribeButtonProps = {
  priceID: string;
};

export function SubscribeButton(props: SubscribeButtonProps) {
  const [session, loading] = useSession();

  async function handleSubscribe() {
    if (!session) {
      signIn("github");
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
