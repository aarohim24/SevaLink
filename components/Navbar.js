'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Heart, Building2, Home, Menu, X, Zap } from 'lucide-react';
import styles from './Navbar.module.css';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/match', label: 'Match Engine', icon: Zap },
  { href: '/volunteer', label: 'Volunteer', icon: Heart },
  { href: '/ngo', label: 'NGO Portal', icon: Building2 },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <Zap size={18} />
          </div>
          <span className={styles.logoText}>
            <span className="text-gradient">Seva</span>
            <span style={{ color: 'var(--accent-light)' }}>Link</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className={styles.navLinks}>
          {navLinks.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={`${styles.navLink} ${pathname === href ? styles.active : ''}`}
              >
                <Icon size={15} />
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className={styles.navActions}>
          <Link href="/volunteer" className="btn btn-accent btn-sm hide-mobile">
            <Heart size={14} />
            Join as Volunteer
          </Link>
          <button
            className={styles.menuBtn}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.mobileLink} ${pathname === href ? styles.activeMobile : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
          <Link
            href="/volunteer"
            className={`btn btn-accent ${styles.mobileCta}`}
            onClick={() => setMenuOpen(false)}
          >
            <Heart size={16} />
            Join as Volunteer
          </Link>
        </div>
      )}
    </nav>
  );
}
