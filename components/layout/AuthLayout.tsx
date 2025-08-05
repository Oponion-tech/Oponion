import React from "react";
import Image from "next/image";
import styles from "./styles/AuthLayout.module.css";

interface AuthLayoutProps {
  children: React.ReactNode;
  isRegister?: boolean;
  welcomeTitle?: string;
  welcomeMessage?: string;
}

export default function AuthLayout({
  children,
  isRegister = false,
  welcomeTitle = "OPONION",
  welcomeMessage = "Welcome Back! Log in to access surveys, collect Oponion Rings and explore more opinions.",
}: AuthLayoutProps) {
  return (
    <div
      className={`${styles.authContainer} ${
        isRegister ? styles.register : styles.login
      }`}
    >
      {!isRegister && (
        <div className={styles.nonContentPanel}>
          <Image src="/logo.png" alt="Oponion Logo" width={80} height={80} />
          <h1 className={styles.heading1}>{welcomeTitle}</h1>
          <p className={styles.welcomeText}>{welcomeMessage}</p>
        </div>
      )}

      <div className={styles.contentPanel}>
        <div className={styles.contentPanelContent}>{children}</div>
      </div>

      {isRegister && (
        <div className={styles.nonContentPanel}>
          <Image src="/logo.png" alt="Oponion Logo" width={80} height={80} />
          <h1 className={styles.heading1}>{welcomeTitle}</h1>
          <p className={styles.welcomeText}>{welcomeMessage}</p>
        </div>
      )}
    </div>
  );
}
