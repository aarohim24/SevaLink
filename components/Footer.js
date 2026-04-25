import Link from 'next/link';
import { Heart, ExternalLink, MessageCircle, Mail, Zap } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.logoRow}>
              <div className={styles.logoIcon}>
                <Zap size={16} />
              </div>
              <span className={styles.logoText}>
                <span className="text-gradient">Seva</span>
                <span style={{ color: 'var(--accent-light)' }}>Link</span>
              </span>
            </div>
            <p className={styles.tagline}>
              Transforming community data into action. Connecting volunteers with needs in real time.
            </p>
            <div className={styles.sdgBadges}>
              <span className={styles.sdgBadge}>🌍 SDG 1</span>
              <span className={styles.sdgBadge}>🏙️ SDG 11</span>
              <span className={styles.sdgBadge}>🤝 SDG 17</span>
            </div>
          </div>

          <div>
            <h4 className={styles.colTitle}>Platform</h4>
            <ul className={styles.linkList}>
              <li><Link href="/dashboard">Data Dashboard</Link></li>
              <li><Link href="/match">Match Engine</Link></li>
              <li><Link href="/volunteer">Volunteer Portal</Link></li>
              <li><Link href="/ngo">NGO Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className={styles.colTitle}>About</h4>
            <ul className={styles.linkList}>
              <li><a href="#">Our Mission</a></li>
              <li><a href="#">Impact Stories</a></li>
              <li><a href="#">Partner NGOs</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className={styles.colTitle}>Contact</h4>
            <ul className={styles.contactList}>
              <li>
                <Mail size={14} />
                hello@sevalink.org
              </li>
            </ul>
            <div className={styles.socials}>
              <a href="#" className={styles.socialBtn} aria-label="GitHub"><ExternalLink size={18} /></a>
              <a href="#" className={styles.socialBtn} aria-label="Twitter"><MessageCircle size={18} /></a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            © 2026 SevaLink. Built with <Heart size={12} style={{ color: 'var(--danger)', display: 'inline' }} /> for the Google Solution Challenge.
          </p>
          <p className={styles.copy}>
            Aligned with UN Sustainable Development Goals
          </p>
        </div>
      </div>
    </footer>
  );
}
