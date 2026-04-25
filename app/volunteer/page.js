'use client';
import { useState } from 'react';
import {
  Heart, CheckCircle, Clock, Users, Star, MapPin, Award,
  Plus, TrendingUp, Zap, Shield, Globe, Stethoscope, Medal
} from 'lucide-react';
import volunteersData from '@/data/volunteers.json';
import needsData from '@/data/needs.json';
import styles from './page.module.css';

const skillOptions = ['medical', 'nursing', 'first aid', 'teaching', 'counseling',
  'logistics', 'driving', 'communication', 'construction', 'cooking', 'caregiving',
  'psychology', 'carpentry', 'physical labor', 'sewing', 'crafts'];

export default function VolunteerPage() {
  const [tab, setTab] = useState('profile'); // profile | tasks | impact
  const [registered, setRegistered] = useState(false);
  const [profile, setProfile] = useState({
    name: '', email: '', phone: '', district: 'Mumbai',
    skills: [], availability: 'weekends', bio: '',
  });
  const [acceptedTasks] = useState(
    needsData.filter(n => [0, 2, 5].includes(needsData.indexOf(n))).slice(0, 3)
  );
  const demoVolunteer = volunteersData[0];

  const toggleSkill = (skill) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setRegistered(true);
    setTab('tasks');
  };

  const impactStats = [
    { label: 'Tasks Completed', value: demoVolunteer.tasksCompleted, icon: CheckCircle, color: 'var(--accent-light)' },
    { label: 'Hours Volunteered', value: demoVolunteer.totalHours, icon: Clock, color: 'var(--primary-light)' },
    { label: 'People Helped', value: demoVolunteer.peopleHelped, icon: Users, color: 'var(--warning)' },
    { label: 'Rating', value: `${demoVolunteer.rating}/5`, icon: Star, color: '#EC4899' },
  ];

  const badges = [
    { icon: Shield,     label: 'First Responder', desc: 'Accepted emergency task within 1hr' },
    { icon: Medal,      label: 'Top Volunteer',   desc: '50+ hours in a month' },
    { icon: Stethoscope, label: 'Healthcare Hero', desc: '10+ medical tasks completed' },
    { icon: Globe,      label: 'SDG Champion',    desc: 'Contributed to 3+ SDGs' },
  ];

  return (
    <div className="page-wrapper">
      <div className={`container ${styles.pageContainer}`}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <div>
            <div className="section-tag" style={{ display: 'inline-flex', marginBottom: '0.5rem' }}>
              <Heart size={11} /> Volunteer Portal
            </div>
            <h1 className="heading-xl">Your Volunteer Hub</h1>
            <p className="text-muted" style={{ marginTop: '0.5rem' }}>
              Track your missions, manage your profile, and see your real-world impact.
            </p>
          </div>
          <div className={styles.headerBadge}>
            <Award size={18} style={{ color: 'var(--warning)' }} />
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--warning)' }}>Top Volunteer</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>April 2026</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {[
            { id: 'profile', label: 'My Profile', icon: Users },
            { id: 'tasks', label: 'My Tasks', icon: CheckCircle },
            { id: 'impact', label: 'Impact Report', icon: TrendingUp },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`${styles.tab} ${tab === id ? styles.tabActive : ''}`}
              onClick={() => setTab(id)}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div className={styles.tabContent}>
            {registered ? (
              <div className={styles.successBanner}>
                <CheckCircle size={20} />
                <div>
                  <div style={{ fontWeight: 600 }}>Profile registered successfully!</div>
                  <div style={{ fontSize: '0.82rem', opacity: 0.8 }}>You'll receive task matches in your area soon.</div>
                </div>
              </div>
            ) : null}

            <div className={styles.profileLayout}>
              {/* Form */}
              <div className={`glass-card ${styles.profileFormCard}`}>
                <h3 className="heading-md" style={{ marginBottom: '1.5rem' }}>
                  {registered ? (
                    <><CheckCircle size={14} /> Your Profile</>
                  ) : (
                    <><Plus size={14} /> Register as a Volunteer</>
                  )}
                </h3>
                <form onSubmit={handleRegister} className={styles.profileForm}>
                  <div className={styles.formRow}>
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input className="form-input" placeholder="Priya Sharma"
                        value={profile.name}
                        onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                        required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input type="email" className="form-input" placeholder="priya@email.com"
                        value={profile.email}
                        onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                        required />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input className="form-input" placeholder="+91 9876543210"
                        value={profile.phone}
                        onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">District</label>
                      <select className="form-select"
                        value={profile.district}
                        onChange={e => setProfile(p => ({ ...p, district: e.target.value }))}>
                        {['Mumbai', 'Thane', 'Navi Mumbai', 'Pune', 'Other'].map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Availability</label>
                    <div className={styles.availRow}>
                      {['daily', 'weekdays', 'weekends'].map(a => (
                        <button key={a} type="button"
                          className={`${styles.availBtn} ${profile.availability === a ? styles.availBtnActive : ''}`}
                          onClick={() => setProfile(p => ({ ...p, availability: a }))}>
                          <Clock size={13} />
                          {a.charAt(0).toUpperCase() + a.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Skills ({profile.skills.length} selected)</label>
                    <div className={styles.skillsGrid}>
                      {skillOptions.map(skill => (
                        <button key={skill} type="button"
                          className={`${styles.skillBtn} ${profile.skills.includes(skill) ? styles.skillBtnActive : ''}`}
                          onClick={() => toggleSkill(skill)}>
                          {profile.skills.includes(skill) && <CheckCircle size={11} />}
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Short Bio</label>
                    <textarea className="form-textarea"
                      placeholder="Tell NGOs about your motivation to volunteer…"
                      value={profile.bio}
                      onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} />
                  </div>
                  <button type="submit" className="btn btn-accent btn-lg" style={{ alignSelf: 'flex-start' }}>
                    <Heart size={16} />
                    {registered ? 'Update Profile' : 'Register Now'}
                  </button>
                </form>
              </div>

              {/* Demo Volunteer Sidebar */}
              <div className={styles.sidebarCards}>
                <div className={`glass-card ${styles.demoCard}`}>
                  <div className={styles.demoAvatar}>
                    <div className="avatar avatar-lg">{demoVolunteer.avatar}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem' }}>{demoVolunteer.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{demoVolunteer.location}</div>
                    </div>
                  </div>
                  <div className="divider" />
                  <div className={styles.demoStats}>
                    {impactStats.map(({ label, value, icon: Icon, color }) => (
                      <div key={label} className={styles.demoStat}>
                        <Icon size={16} style={{ color }} />
                        <div className={styles.demoStatValue}>{value}</div>
                        <div className={styles.demoStatLabel}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`glass-card ${styles.badgesCard}`}>
                  <h4 className="heading-md" style={{ marginBottom: '1rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={16} style={{ color: 'var(--teal)' }} />
                    Badges Earned
                  </h4>
                  <div className={styles.badgesList}>
                  {badges.map(({ icon: Icon, label, desc }) => (
                    <div key={label} className={styles.badgeItem}>
                      <div className={styles.badgeIcon}>
                        <Icon size={18} style={{ color: 'var(--teal)' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{desc}</div>
                      </div>
                    </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {tab === 'tasks' && (
          <div className={styles.tabContent}>
            <div className={styles.tasksSectionHeader}>
              <h2 className="heading-md">Accepted Tasks ({acceptedTasks.length})</h2>
              <a href="/match" className="btn btn-primary btn-sm">
                <Plus size={14} /> Find More Tasks
              </a>
            </div>
            <div className={styles.tasksList}>
              {acceptedTasks.map((task, i) => (
                <div key={task.id} className={`glass-card ${styles.taskCard}`}>
                  <div className={styles.taskStatus}>
                    <span className={`badge ${i === 0 ? 'badge-warning' : 'badge-accent'}`}>
                      {i === 0 ? 'In Progress' : 'Upcoming'}
                    </span>
                    <span className="text-xs text-muted">
                      {new Date(task.postedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{task.title}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{task.description}</p>
                  <div className={styles.taskMeta}>
                    <span><MapPin size={12} /> {task.location}</span>
                    <span><Users size={12} /> {task.postedBy}</span>
                    <span><Clock size={12} /> {task.availability || 'Flexible'}</span>
                  </div>
                  <div className={styles.taskSkills}>
                    {task.skillsRequired.map(s => <span key={s} className="badge badge-primary">{s}</span>)}
                  </div>
                </div>
              ))}
            </div>

            <div className={`glass-card ${styles.emptyTasksCard}`}>
              <Plus size={32} style={{ color: 'var(--text-muted)', margin: '0 auto', display: 'block' }} />
              <p className="text-center text-muted" style={{ marginTop: '0.75rem', fontSize: '0.875rem' }}>
                Find more tasks that match your skills
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <a href="/match" className="btn btn-primary">
                  <Zap size={16} /> Go to Match Engine
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Impact Tab */}
        {tab === 'impact' && (
          <div className={styles.tabContent}>
            <div className={styles.impactGrid}>
              {impactStats.map(({ label, value, icon: Icon, color }) => (
                <div key={label} className={`glass-card ${styles.impactCard}`}>
                  <div className={styles.impactIcon} style={{ background: `${color}18` }}>
                    <Icon size={24} style={{ color }} />
                  </div>
                  <div className={styles.impactValue} style={{ color }}>{value}</div>
                  <div className={styles.impactLabel}>{label}</div>
                </div>
              ))}
            </div>

            <div className={`glass-card ${styles.sdgImpactCard}`}>
              <h3 className="heading-md" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Globe size={18} style={{ color: 'var(--teal)' }} />
                SDG Contributions
              </h3>
              <div className={styles.sdgList}>
                {[
                  { sdg: 'SDG 1 — No Poverty', pct: 85, color: 'var(--danger)' },
                  { sdg: 'SDG 2 — Zero Hunger', pct: 72, color: 'var(--warning)' },
                  { sdg: 'SDG 3 — Good Health', pct: 90, color: 'var(--accent-light)' },
                  { sdg: 'SDG 11 — Sustainable Communities', pct: 65, color: 'var(--primary-light)' },
                ].map(({ sdg, pct, color }) => (
                  <div key={sdg} className={styles.sdgRow}>
                    <div className={styles.sdgRowLabel}>{sdg}</div>
                    <div className={styles.sdgRowBar}>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                      </div>
                      <span style={{ color, fontSize: '0.8rem', fontWeight: 700, minWidth: 36, textAlign: 'right' }}>{pct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

