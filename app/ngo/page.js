'use client';
import { useState } from 'react';
import {
  Building2, Plus, CheckCircle, Clock, Users, TrendingUp,
  MapPin, AlertTriangle, BarChart2, FileText, Edit3,
  Lightbulb, ClipboardList, Target, Timer, Navigation, UserCheck
} from 'lucide-react';
import needsData from '@/data/needs.json';
import metricsData from '@/data/metrics.json';
import styles from './page.module.css';

const categories = ['Food Security', 'Healthcare', 'Education', 'Housing',
  'Water & Sanitation', 'Mental Health', 'Livelihood', 'Elder Care'];

const skillOptions = ['medical', 'nursing', 'first aid', 'teaching', 'counseling',
  'logistics', 'driving', 'communication', 'construction', 'cooking', 'caregiving',
  'psychology', 'carpentry', 'physical labor'];

const urgencyLabel = (u) =>
  u >= 5 ? 'Critical' : u >= 4 ? 'High' : u >= 3 ? 'Medium' : u >= 2 ? 'Low' : 'Minimal';

export default function NGOPage() {
  const [tab, setTab] = useState('post'); // post | needs | impact
  const [postedNeeds, setPostedNeeds] = useState(
    needsData.filter(n => ['Roti Bank Foundation', 'Heal India NGO'].includes(n.postedBy))
  );
  const [ngoForm, setNgoForm] = useState({
    name: '', email: '', city: '', type: 'NGO', focus: '',
  });
  const [ngoRegistered, setNgoRegistered] = useState(false);
  const [form, setForm] = useState({
    title: '', category: 'Food Security', location: '', district: 'Mumbai',
    urgency: 3, skills: [], volunteersNeeded: 1, description: '', deadline: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const { kpis } = metricsData;

  const toggleSkill = (skill) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handlePostNeed = (e) => {
    e.preventDefault();
    const need = {
      ...form,
      id: `N${String(needsData.length + postedNeeds.length + 1).padStart(3, '0')}`,
      skillsRequired: form.skills,
      volunteersAssigned: 0,
      status: 'open',
      postedBy: ngoForm.name || 'My NGO',
      postedAt: new Date().toISOString(),
    };
    setPostedNeeds(prev => [need, ...prev]);
    setSubmitted(true);
    setForm({ title: '', category: 'Food Security', location: '', district: 'Mumbai',
      urgency: 3, skills: [], volunteersNeeded: 1, description: '', deadline: '' });
    setTimeout(() => setSubmitted(false), 4000);
    setTab('needs');
  };

  const handleNgoRegister = (e) => {
    e.preventDefault();
    setNgoRegistered(true);
  };

  const urgencyColor = (u) => u >= 5 ? 'var(--danger)' : u >= 4 ? '#F97316' : u >= 3 ? 'var(--warning)' : 'var(--accent)';

  const impactStats = [
    { label: 'Needs Resolved', value: 12, icon: CheckCircle, color: 'var(--accent-light)' },
    { label: 'Avg Response Time', value: '2.4h', icon: Clock, color: 'var(--primary-light)' },
    { label: 'Volunteers Deployed', value: 48, icon: Users, color: 'var(--warning)' },
    { label: 'People Reached', value: 1240, icon: TrendingUp, color: '#EC4899' },
  ];

  return (
    <div className="page-wrapper">
      <div className={`container ${styles.pageContainer}`}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <div>
            <div className="section-tag" style={{ display: 'inline-flex', marginBottom: '0.5rem' }}>
              <Building2 size={11} /> NGO Portal
            </div>
            <h1 className="heading-xl">NGO Command Center</h1>
            <p className="text-muted" style={{ marginTop: '0.5rem' }}>
              Post needs, track responses, and measure your organization's real-world impact.
            </p>
          </div>
        </div>

        {/* NGO Registration Banner */}
        {!ngoRegistered && (
          <div className={`glass-card ${styles.regBanner}`}>
            <div>
              <h3 className={styles.regTitle}><Building2 size={18} /> Register Your NGO</h3>
              <p className="text-muted text-sm">Join 24+ NGOs already on the platform.</p>
            </div>
            <form onSubmit={handleNgoRegister} className={styles.regForm}>
              <input className="form-input" placeholder="Organization Name" required
                value={ngoForm.name} onChange={e => setNgoForm(p => ({ ...p, name: e.target.value }))} />
              <input type="email" className="form-input" placeholder="Contact Email" required
                value={ngoForm.email} onChange={e => setNgoForm(p => ({ ...p, email: e.target.value }))} />
              <input className="form-input" placeholder="City" required
                value={ngoForm.city} onChange={e => setNgoForm(p => ({ ...p, city: e.target.value }))} />
              <button type="submit" className="btn btn-primary">Register NGO</button>
            </form>
          </div>
        )}

        {ngoRegistered && (
          <div className={styles.ngoWelcome}>
            <CheckCircle size={20} style={{ color: 'var(--accent-light)' }} />
            <span>Welcome, <strong>{ngoForm.name}</strong>! Your NGO is now registered on SevaLink.</span>
          </div>
        )}

        {/* Tabs */}
        <div className={styles.tabs}>
          {[
            { id: 'post', label: 'Post a Need', icon: Plus },
            { id: 'needs', label: `My Needs (${postedNeeds.length})`, icon: FileText },
            { id: 'impact', label: 'Impact Report', icon: BarChart2 },
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

        {/* POST TAB */}
        {tab === 'post' && (
          <div className={styles.tabContent}>
            {submitted && (
              <div className={styles.successBanner}>
                <CheckCircle size={18} />
                Need posted successfully! Volunteers will be matched shortly.
              </div>
            )}
            <div className={styles.postLayout}>
              <div className={`glass-card ${styles.postFormCard}`}>
                <h3 className="heading-md" style={{ marginBottom: '1.5rem' }}>
                  <Edit3 size={18} style={{ display: 'inline', marginRight: 8 }} />
                  Post a Community Need
                </h3>
                <form onSubmit={handlePostNeed} className={styles.postForm}>
                  <div className={styles.formGrid}>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Need Title *</label>
                      <input className="form-input" placeholder="e.g. Emergency Medical Camp"
                        value={form.title}
                        onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                        required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category *</label>
                      <select className="form-select" value={form.category}
                        onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                        {categories.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">District</label>
                      <select className="form-select" value={form.district}
                        onChange={e => setForm(p => ({ ...p, district: e.target.value }))}>
                        {['Mumbai', 'Thane', 'Navi Mumbai', 'Pune', 'Other'].map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Specific Location *</label>
                      <input className="form-input" placeholder="e.g. Dharavi, Mumbai"
                        value={form.location}
                        onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                        required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Volunteers Needed</label>
                      <input type="number" className="form-input" min={1} max={100}
                        value={form.volunteersNeeded}
                        onChange={e => setForm(p => ({ ...p, volunteersNeeded: Number(e.target.value) }))} />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Urgency Level</label>
                      <div className={styles.urgencySelector}>
                        {[1, 2, 3, 4, 5].map(u => (
                          <button key={u} type="button"
                            className={`${styles.urgencyBtn} ${form.urgency === u ? styles.urgencyBtnActive : ''}`}
                            style={form.urgency === u ? { borderColor: urgencyColor(u), color: urgencyColor(u), background: `${urgencyColor(u)}18` } : {}}
                            onClick={() => setForm(p => ({ ...p, urgency: u }))}>
                            {u} — {urgencyLabel(u)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Skills Required ({form.skills.length} selected)</label>
                      <div className={styles.skillsGrid}>
                        {skillOptions.map(skill => (
                          <button key={skill} type="button"
                            className={`${styles.skillBtn} ${form.skills.includes(skill) ? styles.skillBtnActive : ''}`}
                            onClick={() => toggleSkill(skill)}>
                            {form.skills.includes(skill) && <CheckCircle size={11} />}
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Description *</label>
                      <textarea className="form-textarea" rows={4}
                        placeholder="Describe the situation, specific requirements, timelines, and impact expected…"
                        value={form.description}
                        onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                        required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Deadline (optional)</label>
                      <input type="date" className="form-input"
                        value={form.deadline}
                        onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} />
                    </div>
                  </div>
                  <div className={styles.formActions}>
                    <button type="reset" className="btn btn-ghost" onClick={() => setForm({
                      title: '', category: 'Food Security', location: '', district: 'Mumbai',
                      urgency: 3, skills: [], volunteersNeeded: 1, description: '', deadline: ''
                    })}>
                      Reset
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <Plus size={16} />
                      Post Need
                    </button>
                  </div>
                </form>
              </div>

              {/* Sidebar Tips */}
              <div className={styles.tipsSidebar}>
                <div className={`glass-card ${styles.tipsCard}`}>
                  <h4 className={styles.tipsTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Lightbulb size={15} style={{ color: 'var(--teal)' }} />
                    Tips for Better Matches
                  </h4>
                  <ul className={styles.tipsList}>
                    <li>Be specific about location — neighborhood level is best</li>
                    <li>List only skills that are truly necessary</li>
                    <li>Higher urgency attracts faster responses</li>
                    <li>Clear descriptions lead to better-prepared volunteers</li>
                    <li>Set realistic volunteer counts to avoid over-requesting</li>
                  </ul>
                </div>
                <div className={`glass-card ${styles.tipsCard}`}>
                  <h4 className={styles.tipsTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BarChart2 size={15} style={{ color: 'var(--teal)' }} />
                    Platform Stats
                  </h4>
                  <div className={styles.platformStats}>
                    <div className={styles.platformStat}>
                      <div className={styles.platformStatValue} style={{ color: 'var(--accent-light)' }}>
                        {kpis.responseTimeReduction}%
                      </div>
                      <div className={styles.platformStatLabel}>Faster responses</div>
                    </div>
                    <div className={styles.platformStat}>
                      <div className={styles.platformStatValue} style={{ color: 'var(--primary-light)' }}>
                        {kpis.matchAccuracy}%
                      </div>
                      <div className={styles.platformStatLabel}>Match accuracy</div>
                    </div>
                    <div className={styles.platformStat}>
                      <div className={styles.platformStatValue} style={{ color: 'var(--warning)' }}>
                        {kpis.activeVolunteers}
                      </div>
                      <div className={styles.platformStatLabel}>Active volunteers</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MY NEEDS TAB */}
        {tab === 'needs' && (
          <div className={styles.tabContent}>
            <div className={styles.needsHeader}>
              <h2 className="heading-md">Posted Needs</h2>
              <button className="btn btn-primary btn-sm" onClick={() => setTab('post')}>
                <Plus size={14} /> Post New Need
              </button>
            </div>
            <div className={styles.needsList}>
              {postedNeeds.map((need) => {
                const fillPct = Math.round((need.volunteersAssigned / need.volunteersNeeded) * 100);
                return (
                  <div key={need.id} className={`glass-card ${styles.needItemCard}`}>
                    <div className={styles.needItemHeader}>
                      <div>
                        <h3 className={styles.needItemTitle}>{need.title}</h3>
                        <div className={styles.needItemMeta}>
                          <span><MapPin size={12} /> {need.location}</span>
                          <span>{need.category}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                            {new Date(need.postedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <div className={styles.needItemBadges}>
                        <span className={`badge ${need.urgency >= 4 ? 'badge-danger' : need.urgency >= 3 ? 'badge-warning' : 'badge-accent'}`}>
                          {urgencyLabel(need.urgency)}
                        </span>
                        <span className="badge badge-primary">{need.status}</span>
                      </div>
                    </div>
                    <p className={styles.needItemDesc}>{need.description}</p>
                    <div className={styles.needItemBottom}>
                      <div className={styles.volunteerProgress}>
                        <div className={styles.progressLabels}>
                          <span className="text-sm text-muted">Volunteers</span>
                          <span className="text-sm" style={{ color: fillPct >= 70 ? 'var(--accent-light)' : 'var(--warning)' }}>
                            {need.volunteersAssigned}/{need.volunteersNeeded}
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill"
                            style={{
                              width: `${fillPct}%`,
                              background: fillPct < 30 ? 'var(--danger)' : fillPct < 70 ? 'var(--warning)' : 'var(--accent)'
                            }}
                          />
                        </div>
                      </div>
                      <div className={styles.needItemSkills}>
                        {need.skillsRequired.slice(0, 3).map(s => (
                          <span key={s} className="badge badge-muted">{s}</span>
                        ))}
                        {need.skillsRequired.length > 3 && (
                          <span className="badge badge-muted">+{need.skillsRequired.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* IMPACT TAB */}
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

            <div className={styles.needsBreakdown}>
              <div className={`glass-card ${styles.breakdownCard}`}>
                <h3 className="heading-md" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ClipboardList size={18} style={{ color: 'var(--teal)' }} />
                  Needs Summary
                </h3>
                <div className={styles.breakdownGrid}>
                  {[
                    { label: 'Total Posted', value: postedNeeds.length, color: 'var(--primary-light)' },
                    { label: 'Currently Open', value: postedNeeds.filter(n => n.status === 'open').length, color: 'var(--warning)' },
                    { label: 'Resolved', value: 12, color: 'var(--accent-light)' },
                    { label: 'Critical (Urgency 5)', value: postedNeeds.filter(n => n.urgency === 5).length, color: 'var(--danger)' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className={styles.breakdownItem}>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color }}>{value}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`glass-card ${styles.breakdownCard}`}>
                <h3 className="heading-md" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Target size={18} style={{ color: 'var(--teal)' }} />
                  KPI Benchmarks
                </h3>
                <div className={styles.kpiList}>
                  {[
                    { label: 'Task allocation time reduced', value: `${kpis.responseTimeReduction}%`, icon: Timer },
                    { label: 'Volunteer-task match accuracy', value: `${kpis.matchAccuracy}%`, icon: Navigation },
                    { label: 'Data consolidated', value: `${kpis.dataConsolidation}%`, icon: BarChart2 },
                    { label: 'Active engagement rate', value: `${kpis.volunteerEngagement}%`, icon: UserCheck },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className={styles.kpiRow}>
                      <span className={styles.kpiEmoji}><Icon size={15} style={{ color: 'var(--teal)' }} /></span>
                      <div className={styles.kpiMeta}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{label}</div>
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-light)' }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
