import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { signIn, signOut, useSession } from "next-auth/client";

import styles from "./styles.module.scss";

export function SignInButton() {
  const [session, loading] = useSession();

  return session ? (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => signOut()}
    >
      <FaGithub className={`${styles.socialIcon} ${styles.signedIn}`} />{" "}
      {session.user?.name} <FiX className={styles.closeIcon} />
    </button>
  ) : (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => signIn("github")}
    >
      <FaGithub className={styles.socialIcon} /> Sign in with GitHub
    </button>
  );
}
