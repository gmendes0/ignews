import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";

import styles from "./styles.module.scss";

export function SignInButton() {
  const isUserLoggedIn = false;

  return isUserLoggedIn ? (
    <button type="button" className={styles.signInButton}>
      <FaGithub className={`${styles.socialIcon} ${styles.signedIn}`} /> Gabriel
      Mendes <FiX className={styles.closeIcon} />
    </button>
  ) : (
    <button type="button" className={styles.signInButton}>
      <FaGithub className={styles.socialIcon} /> Sign in with GitHub
    </button>
  );
}
