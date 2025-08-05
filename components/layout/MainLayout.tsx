import React from "react";
import Navbar from "./Navbar";
import styles from "./styles/MainLayout.module.css";

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function MainLayout({ children, title }: MainLayoutProps) {
  return (
    <div className={styles.mainLayout}>
      <Navbar />
      <main className={styles.content}>
        {title && <h1 className={styles.pageTitle}>{title}</h1>}
        {children}
      </main>
    </div>
  );
}
