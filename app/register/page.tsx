"use client";
import React from "react";
import { AuthLayout } from "@/components/layout";
import styles from "@/components/layout/styles/AuthForm.module.css";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <AuthLayout
      isRegister={true}
      welcomeMessage="Welcome, earn Oponionrings! Get rewards and collect responses."
    >
      <h2 className={styles.heading2}>Create an account</h2>
      <form className={styles.form}>
        <label>Email</label>
        <input type="email" name="email" placeholder="Email" required />
        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <label>Repeat password</label>
        <input
          type="password"
          name="repeat_password"
          placeholder="Repeat password"
          required
        />
        <label className={styles.terms}>
          <input type="checkbox" name="agb" required /> I accept the{" "}
          <Link href="/terms" className={styles.termsLink}>
            GTC
          </Link>
        </label>
        <button type="submit" className={styles.createBtn}>
          Create
        </button>
      </form>
      <div className={styles.switchForm}>
        <span>Already have an account?</span>
        <Link href="/login" className={styles.loginLink}>
          Login!
        </Link>
      </div>
    </AuthLayout>
  );
}
