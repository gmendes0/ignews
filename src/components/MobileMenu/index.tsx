import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

import styles from "./styles.module.scss";

export function MobileMenu() {
  const [menuOpened, setMenuOpened] = useState<boolean>(false);

  return (
    <>
      <div
        style={{ display: menuOpened ? "flex" : "none" }}
        className={styles.mobileNav}
      >
        <nav>
          <a href="" className={styles.active}>
            Home
          </a>
          <a href="">Posts</a>
        </nav>
      </div>

      <button
        type="button"
        className={styles.menuButton}
        onClick={() => setMenuOpened(!menuOpened)}
      >
        {menuOpened ? <FiX /> : <FiMenu />}
      </button>
    </>
  );
}
