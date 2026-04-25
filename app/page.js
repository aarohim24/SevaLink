'use client';
import Link from 'next/link';
import {
  LayoutDashboard, Zap, Smartphone, ArrowRight,
  Users, TrendingUp, Clock, MapPin, Star, CheckCircle,
  Home, Salad, HeartPulse, BookOpen, Building2, Handshake, Globe
} from 'lucide-react';
import styles from './page.module.css';

const pillars = [
  {
    icon: LayoutDashboard,
    colorVar: 'var(--primary-light)',
    bgVar: 'var(--primary-muted)',
    number: '01',
    title: 'Unified Data Intelligence',
    description: 'Convert paper surveys and field reports into structured insights. Instantly surface top urgent needs, geographic hotspots, and weekly trends.',
    features: ['Need prioritization by urgency', 'District heatmap visualization', 'Trend analytics & impact KPIs'],
    link: '/dashboard',
    linkLabel: 'Open Dashboard',
  },
  {
    icon: Zap,
    colorVar: 'var(--accent-light)',
    bgVar: 'var(--accent-muted)',
    number: '02',
    title: 'Smart Volunteer Matching',
    description: 'Algorithmic matching based on skills, location, and urgency score. The right volunteer reaches the right place at the right time.',
    features: ['Skill + location matching', 'Urgency-weighted scoring', 'Clear ranked match results'],
    link: '/match',
    linkLabel: 'Try Matching',
  },
  {
    icon: Smartphone,
    colorVar: 'var(--warm-gold-light)',
    bgVar: 'rgba(201, 150, 63, 0.1)',
    number: '03',
    title: 'Designed for Everyone',
    description: 'Built for low-tech users in rural and urban areas alike. Mobile-first, minimal steps, low-bandwidth optimized. No training required.',
    features: ['Mobile-first layout', 'Minimal input steps', 'Works on slow connections'],
    link: '/volunteer',
    linkLabel: 'Get Started',
  },
];

const stats = [
  { label: 'Volunteers Active', value: '312+', color: 'var(--navy)' },
  { label: 'Tasks Completed', value: '189', color: 'var(--teal)' },
  { label: 'Faster Response Time', value: '67%', color: 'var(--warning)' },
  { label: 'People Helped', value: '4,820+', color: 'var(--danger)' },
];

const testimonials = [
  {
    name: 'Riya Desai',
    role: 'Program Director, Roti Bank Foundation',
    avatar: 'RD',
    quote: 'SevaLink reduced our volunteer coordination time from days to hours. We respond to critical emergencies three times faster now.',
  },
  {
    name: 'Arjun Mehta',
    role: 'Volunteer, 2+ years',
    avatar: 'AM',
    quote: 'I used to search for opportunities manually. Now SevaLink shows exactly where my skills are needed most, within my area.',
  },
  {
    name: 'Dr. Sunita Rao',
    role: 'Founder, Heal India NGO',
    avatar: 'SR',
    quote: 'The impact dashboard helped us demonstrate outcomes to donors clearly. Our grant success rate doubled after showing the data.',
  },
];

const sdgs = [
  { icon: Home,      label: 'SDG 1',  desc: 'No Poverty' },
  { icon: Salad,     label: 'SDG 2',  desc: 'Zero Hunger' },
  { icon: HeartPulse, label: 'SDG 3', desc: 'Good Health' },
  { icon: BookOpen,  label: 'SDG 4',  desc: 'Quality Education' },
  { icon: Building2, label: 'SDG 11', desc: 'Sustainable Cities' },
  { icon: Handshake, label: 'SDG 17', desc: 'Partnerships' },
];

export default function HomePage() {
  return (
    <div className="page-wrapper">
      {/* ---- HERO ---- */}
      <section className={styles.hero}>
        <div className={styles.heroShape} />
        <div className={styles.heroShapeSecondary} />

        <div className={`container ${styles.heroContent}`}>
          <h1 className={`heading-hero ${styles.heroHeading} animate-fade-in`}>
            Turn Community Data<br />
            Into <span className="text-gradient">Real Action</span>
          </h1>

          <p className={`${styles.heroSub} animate-fade-in-up delay-200`}>
            SevaLink connects NGO intelligence with volunteer power — matching the{' '}
            <span className={styles.heroAccentTeal}>right person</span> to the{' '}
            <span className={styles.heroAccentNavy}>right need</span>, at the right time.
          </p>

          <div className={`${styles.heroCtas} animate-fade-in-up delay-300`}>
            <Link href="/dashboard" className="btn btn-primary btn-lg">
              <LayoutDashboard size={17} />
              View Dashboard
            </Link>
            <Link href="/match" className="btn btn-ghost btn-lg">
              <Zap size={17} />
              Try Matching
              <ArrowRight size={15} />
            </Link>
          </div>


        </div>
      </section>

      {/* ---- 3 PILLARS ---- */}
      <section className="section" id="pillars">
        <div className="container">
          <div className="section-header animate-fade-in">
            <div className="section-tag">
              <Zap size={10} />
              How It Works
            </div>
            <h2 className={`heading-xl`}>Three Pillars of Impact</h2>
            <p className={styles.sectionSubtitle}>
              A focused, lean system that turns fragmented data into coordinated action.
            </p>
          </div>

          <div className={styles.pillarsGrid}>
            {pillars.map(({ icon: Icon, colorVar, bgVar, number, title, description, features, link, linkLabel }, i) => (
              <div
                key={title}
                className={`glass-card ${styles.pillarCard} animate-fade-in-up delay-${(i + 1) * 100}`}
              >
                <div className={styles.pillarNumber}>{number}</div>
                <div className={styles.pillarIconWrap} style={{ background: bgVar }}>
                  <Icon size={24} style={{ color: colorVar }} />
                </div>
                <h3 className={`heading-md ${styles.pillarTitle}`}>{title}</h3>
                <p className={styles.pillarDesc}>{description}</p>
                <ul className={styles.pillarFeatures}>
                  {features.map((f) => (
                    <li key={f}>
                      <CheckCircle size={13} style={{ color: colorVar, flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={link} className={`btn btn-ghost btn-sm ${styles.pillarCta}`}>
                  {linkLabel}
                  <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- IMPACT STRIP ---- */}
      <section className={styles.impactStrip}>
        <div className="container">
          <div className={styles.impactInner}>
            <div className={styles.impactText}>
              <h2 className="heading-xl">
                Measurable Impact,{' '}
                <span className="text-gradient-accent">Every Day</span>
              </h2>
              <p className={styles.impactDesc}>
                Every match made through SevaLink is tracked. From emergency food distribution to education drives — we quantify the good being done.
              </p>
              <div className={styles.impactKpis}>
                <div className={styles.impactKpi}>
                  <TrendingUp size={18} style={{ color: 'var(--sky)', flexShrink: 0 }} />
                  <span><strong>67%</strong> faster task allocation</span>
                </div>
                <div className={styles.impactKpi}>
                  <MapPin size={18} style={{ color: 'var(--sky)', flexShrink: 0 }} />
                  <span><strong>89%</strong> volunteer-task match accuracy</span>
                </div>
                <div className={styles.impactKpi}>
                  <Users size={18} style={{ color: 'var(--sky)', flexShrink: 0 }} />
                  <span><strong>78%</strong> active volunteer engagement</span>
                </div>
              </div>
            </div>

            <div className={styles.impactVisual}>
              <div className={styles.impactRing}>
                <div className={styles.impactRingInner}>
                  <div className={styles.impactRingValue}>94%</div>
                  <div className={styles.impactRingLabel}>Data unified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- TESTIMONIALS ---- */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">
              <Star size={10} />
              Voices of Impact
            </div>
            <h2 className="heading-xl">Trusted by Changemakers</h2>
          </div>
          <div className={styles.testimonialGrid}>
            {testimonials.map(({ name, role, avatar, quote }) => (
              <div key={name} className={`glass-card ${styles.testimonialCard}`}>
                <div className={styles.testimonialQuoteIcon}>"</div>
                <p className={styles.testimonialQuote}>{quote}</p>
                <div className={styles.testimonialAuthor}>
                  <div className="avatar">{avatar}</div>
                  <div>
                    <div className={styles.testimonialName}>{name}</div>
                    <div className={styles.testimonialRole}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- SDG ALIGNMENT ---- */}
      <section className={styles.sdgSection}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">
              <Globe size={11} />
              UN SDG Alignment
            </div>
            <h2 className="heading-xl">Built for Global Goals</h2>
            <p className={styles.sectionSubtitle}>
              SevaLink directly addresses 6 UN Sustainable Development Goals.
            </p>
          </div>
          <div className={styles.sdgGrid}>
            {sdgs.map(({ icon: Icon, label, desc }) => (
              <div key={label} className={`glass-card ${styles.sdgCard}`}>
                <div className={styles.sdgEmoji}>
                  <Icon size={22} style={{ color: 'var(--teal)' }} />
                </div>
                <div className={styles.sdgLabel}>{label}</div>
                <div className={styles.sdgDesc}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA BOTTOM ---- */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaBox}>
            <div className="section-tag" style={{ margin: '0 auto 1.25rem', display: 'table' }}>
              Ready to Begin
            </div>
            <h2 className="heading-xl text-center">Make a Difference Today</h2>
            <p className={styles.ctaDesc}>
              Join 312+ volunteers and 24 NGOs already using SevaLink to create measurable community impact.
            </p>
            <div className={styles.ctaBtns}>
              <Link href="/volunteer" className="btn btn-accent btn-lg">
                <Users size={17} />
                Join as Volunteer
              </Link>
              <Link href="/ngo" className="btn btn-primary btn-lg">
                <MapPin size={17} />
                Register Your NGO
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
