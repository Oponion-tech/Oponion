'use client';
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";
import Image from 'next/image';
import { getUserInformation } from "@/api/services/userInformationService";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userData = await getUserInformation();
        setUserInfo(userData);
      } catch (error) {
        console.error('Error loading user info:', error);
      }
    };
    
    loadUserInfo();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <nav className={styles.navbar}>
      <div className={styles["navbar-brand"]}>
        <div className={styles["navbar-logo"]}>
          <Image src="/logo.png" alt="Oponion Logo" width={32} height={32} />
        </div>
        OPONION
      </div>
      <div className={styles["navbar-nav"]}>
        <Link href="/" className={styles["nav-link"] + (pathname === "/" ? " " + styles["active"] : "")}>Home</Link>
        <Link href="/discover" className={styles["nav-link"] + (pathname === "/discover" ? " " + styles["active"] : "")}>Discover</Link>
        <Link href="/create" className={styles["nav-link"] + (pathname === "/create" ? " " + styles["active"] : "")}>Create</Link>
        <div className={styles["search-bar"]}>
          <Image src="/search.png" alt="Search" width={15} height={15} />
          <input type="text" placeholder="Search surveys..." className={styles["search-input"]} />
        </div>
        <div className={styles["profile-icon"]} onClick={() => setDropdownOpen((v) => !v)} ref={dropdownRef}>
          👤
          {dropdownOpen && (
            <div className={styles.dropdownMenu}>
              <div className={styles.dropdownHeader}>
                <div className={styles.dropdownUsername}>{userInfo?.name || 'User'}</div>
                <div className={styles.dropdownPoints}>{userInfo?.points || 0} <Image src="/OponionRing.png" alt="Oponion Logo" width={20} height={20} /></div>
              </div>
              <div className={styles.dropdownDivider}></div>
              <Link href="/profile" className={styles.dropdownLink}>My Profile</Link>
              <Link href="/my-survey" className={styles.dropdownLink}>My Survey</Link>
              <Link href="/points-rewards" className={styles.dropdownLink}>Points & Rewards</Link>
              <Link href="/subscription" className={styles.dropdownLink}>Subscription</Link>
              <Link href="/settings" className={styles.dropdownLink}>Settings</Link>
              <div className={styles.dropdownDivider}></div>
              <button className={styles.dropdownLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 