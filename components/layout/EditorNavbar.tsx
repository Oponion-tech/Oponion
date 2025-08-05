import React from "react";
import Image from "next/image";
import styles from "./styles/EditorNavbar.module.css";

interface EditorNavbarProps {
  title?: string;
  onClose?: () => void;
  onSave?: () => void;
  saveText?: string;
  closeText?: string;
}

export default function EditorNavbar({
  title = "OPONION",
  onClose,
  onSave,
  saveText = "Speichern",
  closeText = "✕",
}: EditorNavbarProps) {
  return (
    <nav className={styles.editorNavbar}>
      <div className={styles.navbarLeft}>
        <Image src="/logo.png" alt="Oponion Logo" width={32} height={32} />
        <span className={styles.brandName}>{title}</span>
      </div>
      <div className={styles.navbarRight}>
        {onClose && (
          <button className={styles.closeButton} onClick={onClose}>
            {closeText}
          </button>
        )}
        {onSave && (
          <button className={styles.saveButton} onClick={onSave}>
            {saveText}
          </button>
        )}
      </div>
    </nav>
  );
}
