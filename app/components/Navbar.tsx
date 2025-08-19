"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";
import Image from "next/image";
import { getUserInformation } from "@/api/services/userInformationService";
import {
  FiHome,
  FiCompass,
  FiPlus,
  FiSearch,
  FiUser,
  FiSettings,
  FiLogOut,
  FiFileText,
  FiAward,
  FiCreditCard,
  FiChevronDown,
  FiMenu,
  FiX,
} from "react-icons/fi";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userData = await getUserInformation();
        setUserInfo(userData);
      } catch (error) {
        console.error("Error loading user info:", error);
      }
    };

    loadUserInfo();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close desktop dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }

      // Close mobile menu when clicking outside
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        mobileMenuOpen
      ) {
        setMobileMenuOpen(false);
      }
    }

    if (dropdownOpen || mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen, mobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.documentElement.style.overflow = "hidden";
    } else {
      // Restore scrolling
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.documentElement.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.documentElement.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    // Also check on initial load
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [mobileMenuOpen]);

  return (
    <div className={styles["navbar-wrapper"]}>
      <nav className={styles.navbar}>
        {/* Left Side: Logo + Navigation */}
        <div className={styles["navbar-left"]}>
          <Link href="/" className={styles["navbar-brand"]}>
            <div className={styles["navbar-logo"]}>
              <Image
                src="/logo.png"
                alt="Oponion Logo"
                width={32}
                height={32}
              />
            </div>
            OPONION
          </Link>

          {/* Desktop Navigation */}
          <div className={styles["navbar-nav"]}>
            <Link
              href="/discover"
              className={
                styles["nav-link"] +
                (pathname === "/discover" ? " " + styles["active"] : "")
              }
            >
              <FiCompass className={styles["nav-icon"]} />
              Discover
            </Link>
            <Link
              href="/create"
              className={
                styles["nav-link"] +
                (pathname === "/create" ? " " + styles["active"] : "")
              }
            >
              <FiPlus className={styles["nav-icon"]} />
              Create
            </Link>
          </div>
        </div>

        {/* Right Side: Search + Profile */}
        <div className={styles["navbar-right"]}>
          {/* Desktop Search */}
          <div className={styles["mobile-search"]}>
            <FiSearch className={styles["mobile-search-icon"]} />
            <input
              type="text"
              placeholder="Search surveys..."
              className={styles["mobile-search-input"]}
            />
          </div>
          <div className={styles["profile-dropdown"]} ref={dropdownRef}>
            <div
              className={styles["profile-trigger"]}
              onClick={() => setDropdownOpen((v) => !v)}
            >
              <div className={styles["profile-icon"]}>
                <FiUser />
              </div>
              <span className={styles["profile-name"]}>
                {userInfo?.name || "User"}
              </span>
              <FiChevronDown
                className={`${styles["chevron-icon"]} ${
                  dropdownOpen ? styles["rotated"] : ""
                }`}
              />
            </div>
            {dropdownOpen && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownHeader}>
                  <div className={styles.dropdownUsername}>
                    {userInfo?.name || "User"}
                  </div>
                  <div className={styles.dropdownPoints}>
                    {userInfo?.points || 0}
                    <Image
                      src="/OponionRing.png"
                      alt="Points"
                      width={20}
                      height={20}
                    />
                  </div>
                </div>
                <div className={styles.dropdownDivider}></div>
                <Link href="/profile" className={styles.dropdownLink}>
                  <FiUser className={styles.dropdownIcon} />
                  My Profile
                </Link>
                <Link href="/my-survey" className={styles.dropdownLink}>
                  <FiFileText className={styles.dropdownIcon} />
                  My Survey
                </Link>
                <Link href="/points-rewards" className={styles.dropdownLink}>
                  <FiAward className={styles.dropdownIcon} />
                  Points & Rewards
                </Link>
                <Link href="/subscription" className={styles.dropdownLink}>
                  <FiCreditCard className={styles.dropdownIcon} />
                  Subscription
                </Link>
                <Link href="/settings" className={styles.dropdownLink}>
                  <FiSettings className={styles.dropdownIcon} />
                  Settings
                </Link>
                <div className={styles.dropdownDivider}></div>
                <button className={styles.dropdownLogout}>
                  <FiLogOut className={styles.dropdownIcon} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className={styles["mobile-menu-container"]}>
          <div className={styles["mobile-profile-icon"]}>
            <FiUser />
          </div>
          <button
            className={styles["mobile-menu-button"]}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            className={styles["mobile-menu-overlay"]}
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className={styles["mobile-menu"]}
              ref={mobileMenuRef}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Menu Header with Close Button */}
              <div className={styles["mobile-menu-header"]}>
                <div className={styles["mobile-menu-title"]}>Menu</div>
                <button
                  className={styles["mobile-close-button"]}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <FiX />
                </button>
              </div>

              <div className={styles["mobile-divider"]}></div>

              {/* Mobile User Info */}
              <div className={styles["mobile-user-info"]}>
                <div className={styles["mobile-user-avatar"]}>
                  <FiUser />
                </div>
                <div className={styles["mobile-user-details"]}>
                  <div className={styles["mobile-username"]}>
                    {userInfo?.name || "User"}
                  </div>
                  <div className={styles["mobile-points"]}>
                    {userInfo?.points || 0}
                    <Image
                      src="/OponionRing.png"
                      alt="Points"
                      width={16}
                      height={16}
                    />
                  </div>
                </div>
              </div>

              <div className={styles["mobile-divider"]}></div>

              {/* Mobile Navigation Links */}
              <div className={styles["mobile-nav-links"]}>
                <Link
                  href="/discover"
                  className={`${styles["mobile-nav-link"]} ${
                    pathname === "/discover" ? styles["active"] : ""
                  }`}
                >
                  <FiCompass className={styles["mobile-nav-icon"]} />
                  Discover
                </Link>
                <Link
                  href="/create"
                  className={`${styles["mobile-nav-link"]} ${
                    pathname === "/create" ? styles["active"] : ""
                  }`}
                >
                  <FiPlus className={styles["mobile-nav-icon"]} />
                  Create
                </Link>

                <div className={styles["mobile-divider"]}></div>

                {/* Mobile Profile Links */}
                <Link href="/profile" className={styles["mobile-nav-link"]}>
                  <FiUser className={styles["mobile-nav-icon"]} />
                  My Profile
                </Link>
                <Link href="/my-survey" className={styles["mobile-nav-link"]}>
                  <FiFileText className={styles["mobile-nav-icon"]} />
                  My Survey
                </Link>
                <Link
                  href="/points-rewards"
                  className={styles["mobile-nav-link"]}
                >
                  <FiAward className={styles["mobile-nav-icon"]} />
                  Points & Rewards
                </Link>
                <Link
                  href="/subscription"
                  className={styles["mobile-nav-link"]}
                >
                  <FiCreditCard className={styles["mobile-nav-icon"]} />
                  Subscription
                </Link>
                <Link href="/settings" className={styles["mobile-nav-link"]}>
                  <FiSettings className={styles["mobile-nav-icon"]} />
                  Settings
                </Link>

                <div className={styles["mobile-divider"]}></div>

                <button className={styles["mobile-logout"]}>
                  <FiLogOut className={styles["mobile-nav-icon"]} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
