import React from 'react';
import styles from './LoginRegister.module.css';
import Image from 'next/image';
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.nonContentPanel}>
        <Image src="/logo.png" alt="Oponion Logo" width={80} height={80} />
        <h1 className={styles.heading1}>OPONION</h1>
        <p className={styles.welcomeText}>
          Welcome Back!<br />
          Log in to access surveys, collect Oponion Rings and explore more opinions.
        </p>
      </div>
      <div className={styles.ContentPanel}>
        <div className={styles.ContentPanelContent}>
        <h2 className={styles.heading2}>Login to your account</h2>
        <form className={styles.form}>
          <label>Email</label>
          <input type="email" name="email" placeholder="Email" required />
          <label>Password</label>
          <input type="password" name="password" placeholder="Password" required />
          <div className={styles.optionsRow}>
            <label className={styles.rememberMe}>  
              <input type="checkbox" name="remember" /> Remember me
            </label>
            <Link href="/forgot-password" className={styles.forgot}>Forgot password?</Link>
          </div>
          <button type="submit" className={styles.loginBtn}>Login</button>
        </form>
        <div className={styles.socialLogin}>
          <span>or login with</span>
          <div className={styles.socialBtns}>
            <button className={styles.socialGoogle}><Image src="/google.png" alt="Google" width={25} height={25} className='social-icon'/></button>
            <button className={styles.socialMicrosoft}><Image src="/microsoft.png" alt="Microsoft" width={25} height={25} className='social-icon'/></button>
            <button className={styles.socialGithub}><Image src="/github.png" alt="GitHub" width={25} height={25} className='social-icon'/></button>
          </div>
        </div>
        <div className={styles.switchForm}>
          <span>Don't have an account?</span>
          <Link href="/register" className={styles.registerLink}>Register</Link>
        </div>
        </div>
      </div>
    </div>
  );
} 