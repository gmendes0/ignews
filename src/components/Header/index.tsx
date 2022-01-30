import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import ActiveLink from "../ActiveLink";

import { MobileMenu } from "../MobileMenu";
import { SignInButton } from "../SignInButton";
import styles from "./styles.module.scss";

export function Header() {
  const router = useRouter();

  console.log(router.asPath);

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="ig.news" />

        <nav>
          <ActiveLink href="/" activeClassName={styles.active}>
            <a>Home</a>
          </ActiveLink>

          <ActiveLink href="/posts" activeClassName={styles.active}>
            <a>Posts</a>
          </ActiveLink>
        </nav>

        <SignInButton />

        <MobileMenu />
      </div>
    </header>
  );
}
