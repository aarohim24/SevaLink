'use client';
import { useState } from 'react';
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  LayoutDashboard, TrendingUp, Users, Clock, CheckCircle,
  AlertTriangle, MapPin, Plus, ChevronUp, Activity, Database
} from 'lucide-react';
import needsData from '@/data/needs.json';
import metricsData from '@/data/metrics.json';
import styles from './page.module.css';

const urgencyColor = (u) => {
  if (u >= 5) return 'var(--danger)';
  if (u >= 4) return '#F97316';
  if (u >= 3) return 'var(--warning)';
  if (u >= 2) return '#84CC16';
  return 'var(--accent)';
};

const urgencyLabel = (u) => {
  if (u >= 5) return 'Critical';
  if (u >= 4) return 'High';
  if (u >= 3) return 'Medium';
  if (u >= 2) return 'Low';
  return 'Minimal';
};

const categoryColors = [
  '#2F4156', '#567C8D', '#B8873A', '#B5504A',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
];

// Custom tooltip for charts
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.chartTooltip}>
      <div className={styles.chartTooltipLabel}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: p.color, fontSize: '0.8rem' }}>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
}

function UrgencyDots({ level }) {
  return (
    <div className="urgency-bar">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`urgency-dot ${i <= level ? `filled-${level}` : ''}`}
        />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [needs, setNeeds] = useState(needsData);
  const [showForm, setShowForm] = useState(false);
  const [newNeed, setNewNeed] = useState({
    title: '', category: 'Food Security', location: '', urgency: 3,
    skillsRequired: '', volunteersNeeded: 1, description: '', postedBy: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const { kpis, weeklyActivity, needsByCategory, districtHotspots } = metricsData;

  const sortedNeeds = [...needs].sort((a, b) => b.urgency - a.urgency);

  const handleSubmit = (e) => {
    e.preventDefault();
    const need = {
      ...newNeed,
      id: `N${String(needs.length + 1).padStart(3, '0')}`,
      status: 'open',
      volunteersAssigned: 0,
      skillsRequired: newNeed.skillsRequired.split(',').map(s => s.trim()).filter(Boolean),
      postedAt: new Date().toISOString(),
    };
    setNeeds(prev => [...prev, need]);
    setSubmitted(true);
    setShowForm(false);
    setNewNeed({ title: '', category: 'Food Security', location: '', urgency: 3,
      skillsRequired: '', volunteersNeeded: 1, description: '', postedBy: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  const kpiCards = [
    {
      label: 'Response Time Reduction',
      value: `${kpis.responseTimeReduction}%`,
      icon: Clock,
      color: 'var(--success)',
      bg: 'var(--success-muted)',
      trend: '+12% vs last month',
    },
    {
      label: 'Match Accuracy',
      value: `${kpis.matchAccuracy}%`,
      icon: CheckCircle,
      color: 'var(--teal)',
      bg: 'var(--accent-muted)',
      trend: '+5% vs last month',
    },
    {
      label: 'Data Consolidated',
      value: `${kpis.dataConsolidation}%`,
      icon: Database,
      color: 'var(--warning)',
      bg: 'var(--warning-muted)',
      trend: '+8% vs last month',
    },
    {
      label: 'Active Volunteers',
      value: kpis.activeVolunteers,
      icon: Users,
      color: 'var(--navy)',
      bg: 'var(--primary-muted)',
      trend: `+${kpis.activeVolunteers - 290} this week`,
    },
  ];

  return (
    <div className="page-wrapper">
      <div className={`container ${styles.pageContainer}`}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <div>
            <div className="section-tag" style={{ display: 'inline-flex', marginBottom: '0.5rem' }}>
              <LayoutDashboard size={11} /> Data Intelligence
            </div>
            <h1 className="heading-xl">Impact Dashboard</h1>
            <p className="text-muted" style={{ marginTop: '0.5rem' }}>
              Real-time overview of community needs, volunteer activity, and impact metrics.
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus size={16} />
            Report New Need
          </button>
        </div>

        {/* Success Banner */}
        {submitted && (
          <div className={styles.successBanner}>
            <CheckCircle size={18} />
            Need reported successfully! It's now visible in the urgency table.
          </div>
        )}

        {/* Data Input Form */}
        {showForm && (
          <div className={`glass-card ${styles.formCard}`}>
            <h3 className={styles.formTitle}>
              <Database size={18} />
              Report a Community Need
            </h3>
            <form onSubmit={handleSubmit} className={styles.needForm}>
              <div className={styles.formGrid}>
                <div className="form-group">
                  <label className="form-label">Need Title *</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Emergency Food Distribution"
                    value={newNeed.title}
                    onChange={e => setNewNeed(p => ({ ...p, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    value={newNeed.category}
                    onChange={e => setNewNeed(p => ({ ...p, category: e.target.value }))}
                  >
                    {['Food Security','Healthcare','Education','Housing',
                      'Water & Sanitation','Mental Health','Livelihood','Elder Care'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Dharavi, Mumbai"
                    value={newNeed.location}
                    onChange={e => setNewNeed(p => ({ ...p, location: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Urgency Level (1–5)</label>
                  <select
                    className="form-select"
                    value={newNeed.urgency}
                    onChange={e => setNewNeed(p => ({ ...p, urgency: Number(e.target.value) }))}
                  >
                    {[1,2,3,4,5].map(n => (
                      <option key={n} value={n}>{n} — {urgencyLabel(n)}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Skills Required (comma-separated)</label>
                  <input
                    className="form-input"
                    placeholder="e.g. medical, driving, teaching"
                    value={newNeed.skillsRequired}
                    onChange={e => setNewNeed(p => ({ ...p, skillsRequired: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Volunteers Needed</label>
                  <input
                    type="number"
                    className="form-input"
                    min={1} max={100}
                    value={newNeed.volunteersNeeded}
                    onChange={e => setNewNeed(p => ({ ...p, volunteersNeeded: Number(e.target.value) }))}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Posted by (NGO/Organization)</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Roti Bank Foundation"
                    value={newNeed.postedBy}
                    onChange={e => setNewNeed(p => ({ ...p, postedBy: e.target.value }))}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Describe the need in detail..."
                    value={newNeed.description}
                    onChange={e => setNewNeed(p => ({ ...p, description: e.target.value }))}
                  />
                </div>
              </div>
              <div className={styles.formActions}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Need Report</button>
              </div>
            </form>
          </div>
        )}

        {/* KPI Cards */}
        <div className={styles.kpiGrid}>
          {kpiCards.map(({ label, value, icon: Icon, color, bg, trend }) => (
            <div key={label} className={`glass-card ${styles.kpiCard}`}>
              <div className={styles.kpiIcon} style={{ background: bg }}>
                <Icon size={20} style={{ color }} />
              </div>
              <div className={styles.kpiValue} style={{ color }}>{value}</div>
              <div className={styles.kpiLabel}>{label}</div>
              <div className={styles.kpiTrend}>
                <ChevronUp size={12} style={{ color: 'var(--accent-light)' }} />
                {trend}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className={styles.chartsRow}>
          {/* Area Chart: Weekly Activity */}
          <div className={`glass-card ${styles.chartCard}`}>
            <div className={styles.chartHeader}>
              <div>
                <h3 className="heading-md">Volunteer Activity</h3>
                <p className="text-muted text-sm">Past 7 weeks</p>
              </div>
              <Activity size={20} style={{ color: 'var(--primary-light)' }} />
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={weeklyActivity}>
                <defs>
                  <linearGradient id="colorVolunteers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2F4156" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#2F4156" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPeople" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#567C8D" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#567C8D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(47,65,86,0.07)" />
                <XAxis dataKey="week" tick={{ fill: '#8BA7B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8BA7B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="volunteersActive" name="Volunteers" stroke="#2F4156" strokeWidth={2} fill="url(#colorVolunteers)" />
                <Area type="monotone" dataKey="peopleHelped" name="People Helped" stroke="#567C8D" strokeWidth={2} fill="url(#colorPeople)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart: Needs by Category */}
          <div className={`glass-card ${styles.chartCard}`}>
            <div className={styles.chartHeader}>
              <div>
                <h3 className="heading-md">Needs by Category</h3>
                <p className="text-muted text-sm">Open + urgent breakdown</p>
              </div>
              <TrendingUp size={20} style={{ color: 'var(--accent-light)' }} />
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={needsByCategory} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(47,65,86,0.07)" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#8BA7B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="category" type="category" tick={{ fill: '#567C8D', fontSize: 11 }} axisLine={false} tickLine={false} width={110} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="Total" radius={[0, 4, 4, 0]}>
                  {needsByCategory.map((entry, index) => (
                    <Cell key={index} fill={categoryColors[index % categoryColors.length]} opacity={0.8} />
                  ))}
                </Bar>
                <Bar dataKey="urgent" name="Urgent" fill="var(--danger)" radius={[0, 4, 4, 0]} opacity={0.75} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row: Urgency Table + Hotspot Map */}
        <div className={styles.bottomRow}>
          {/* Urgent Needs Table */}
          <div className={`glass-card ${styles.tableCard}`}>
            <div className={styles.chartHeader}>
              <div>
                <h3 className="heading-md" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={18} style={{ color: 'var(--danger)' }} />
                  Top Urgent Needs
                </h3>
                <p className="text-muted text-sm">Sorted by urgency — {needs.length} active</p>
              </div>
              <AlertTriangle size={20} style={{ color: 'var(--danger)' }} />
            </div>
            <div className={styles.needsTable}>
              <div className={styles.tableHeader}>
                <span>Need</span>
                <span>Location</span>
                <span>Urgency</span>
                <span>Volunteers</span>
                <span>Status</span>
              </div>
              {sortedNeeds.slice(0, 8).map((need) => {
                const fillPct = Math.round((need.volunteersAssigned / need.volunteersNeeded) * 100);
                return (
                  <div key={need.id} className={styles.tableRow}>
                    <div className={styles.needInfo}>
                      <div className={styles.needTitle}>{need.title}</div>
                      <div className={styles.needCategory}>{need.category} · {need.postedBy}</div>
                    </div>
                    <div className={styles.needLocation}>
                      <MapPin size={12} />
                      {need.location.split(',')[0]}
                    </div>
                    <div>
                      <UrgencyDots level={need.urgency} />
                      <span
                        className={styles.urgencyLabel}
                        style={{ color: urgencyColor(need.urgency) }}
                      >
                        {urgencyLabel(need.urgency)}
                      </span>
                    </div>
                    <div className={styles.volProgress}>
                      <div className={styles.volNumbers}>
                        {need.volunteersAssigned}/{need.volunteersNeeded}
                      </div>
                      <div className="progress-bar" style={{ width: 80 }}>
                        <div
                          className="progress-fill"
                          style={{
                            width: `${fillPct}%`,
                            background: fillPct < 30 ? 'var(--danger)' : fillPct < 70 ? 'var(--warning)' : 'var(--accent)'
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <span className={`badge ${need.urgency >= 4 ? 'badge-danger' : need.urgency >= 3 ? 'badge-warning' : 'badge-accent'}`}>
                        {need.status === 'open' ? 'Open' : 'Filled'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hotspot Map */}
          <div className={`glass-card ${styles.hotspotCard}`}>
            <div className={styles.chartHeader}>
              <div>
                <h3 className="heading-md" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={18} style={{ color: 'var(--teal)' }} />
                  District Hotspots
                </h3>
                <p className="text-muted text-sm">Urgency heatmap</p>
              </div>
              <MapPin size={20} style={{ color: 'var(--warning)' }} />
            </div>
            <div className={styles.hotspotGrid}>
              {districtHotspots.map(({ name, urgencyScore, openNeeds, volunteersNeeded }) => {
                const intensity = urgencyScore / 100;
                const bg = urgencyScore >= 85
                  ? `rgba(181,80,74,${0.10 + intensity * 0.15})`
                  : urgencyScore >= 70
                  ? `rgba(184,135,58,${0.10 + intensity * 0.12})`
                  : urgencyScore >= 50
                  ? `rgba(200,217,230,${0.25 + intensity * 0.15})`
                  : `rgba(61,139,110,${0.07 + intensity * 0.10})`;
                const borderColor = urgencyScore >= 85 ? 'rgba(181,80,74,0.35)'
                  : urgencyScore >= 70 ? 'rgba(184,135,58,0.3)'
                  : urgencyScore >= 50 ? 'rgba(86,124,141,0.25)' : 'rgba(61,139,110,0.2)';
                const textColor = urgencyScore >= 85 ? 'var(--danger)'
                  : urgencyScore >= 70 ? 'var(--warning)'
                  : urgencyScore >= 50 ? 'var(--teal)' : 'var(--success)';
                return (
                  <div
                    key={name}
                    className={styles.hotspotCell}
                    style={{ background: bg, borderColor }}
                    title={`${name}: ${openNeeds} open needs, ${volunteersNeeded} volunteers needed`}
                  >
                    <div className={styles.hotspotName}>{name}</div>
                    <div className={styles.hotspotScore} style={{ color: textColor }}>
                      {urgencyScore}
                    </div>
                    <div className={styles.hotspotNeeds}>{openNeeds} needs</div>
                  </div>
                );
              })}
            </div>
            <div className={styles.hotspotLegend}>
              <span style={{ color: 'var(--danger)' }}>● Critical</span>
              <span style={{ color: 'var(--warning)' }}>● High</span>
              <span style={{ color: '#C4A44A' }}>● Medium</span>
              <span style={{ color: 'var(--success)' }}>● Low</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
