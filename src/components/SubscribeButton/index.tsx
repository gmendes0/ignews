import styles from "./styles.module.scss";

type SubscribeButtonProps = {
  priceID: string;
};

export function SubscribeButton(props: SubscribeButtonProps) {
  return (
    <button type="button" className={styles.subscribeButton}>
      Subscribe now
    </button>
  );
}
