'use client';
import React from 'react';
import styles from '../login/LoginRegister.module.css';
import logo from '../../public/logo.png';
import Image from 'next/image';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className={styles.container}>
      <div className={styles.ContentPanel}>
      <div className={styles.ContentPanelContent}>
        <h2 className={styles.heading2}>Create an account</h2>
        <form className={styles.form}>
          <label>Email</label>
          <input type="email" name="email" placeholder="Email" required />
          <label>Password</label>
          <input type="password" name="password" placeholder="Password" required />
          <label>Repeat password</label>
          <input type="password" name="repeat_password" placeholder="Repeat password" required />
          <label className={styles.terms}>
            <input type="checkbox" name="agb" required /> I accept the <Link href="/terms" className={styles.termsLink}>GTC</Link>
          </label>
          <button type="submit" className={styles.createBtn}>Create</button>
        </form>
        <div className={styles.switchForm}>
          <span>Already have an account?</span>
          <Link href="/login" className={styles.loginLink}>Login!</Link>
        </div>
        </div>
      </div>
      <div className={styles.nonContentPanel}>
        <Image src={logo} alt="Oponion Logo" width={80} height={80} />
        <h1 className={styles.heading1}>OPONION</h1>
        <p className={styles.welcomeText}>
          Welcome, earn Oponionrings!<br />
          Get rewards and collect responses.
        </p>
      </div>
    </div>
  );
} 