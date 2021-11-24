import { FiMenu } from "react-icons/fi";

import styles from "./styles.module.scss";

export function MobileMenu() {
  return (
    <>
      <button type="button" className={styles.menuButton}>
        <FiMenu />
      </button>

      {/* <nav className="mobileNav"></nav> */}
    </>
  );
}
