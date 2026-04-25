'use client';
import { useState } from 'react';
import { Zap, MapPin, Clock, Star, CheckCircle, X, Filter, Search, Users, Sparkles, Loader2 } from 'lucide-react';
import volunteersData from '@/data/volunteers.json';
import needsData from '@/data/needs.json';
import styles from './page.module.css';

// ---- MATCHING ALGORITHM ----
function computeMatchScore(volunteer, need) {
  // Skill match: proportion of required skills that volunteer has
  const requiredSkills = need.skillsRequired || [];
  const volSkills = volunteer.skills || [];
  const matchedSkills = requiredSkills.filter(s =>
    volSkills.some(vs => vs.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(vs.toLowerCase()))
  );
  const skillScore = requiredSkills.length > 0 ? matchedSkills.length / requiredSkills.length : 0.5;

  // Proximity: same district = 1.0, else 0.3
  const sameDistrict = volunteer.district?.toLowerCase() === need.district?.toLowerCase();
  const proximityScore = sameDistrict ? 1.0 : 0.3;

  // Urgency contribution (normalized 0–1)
  const urgencyScore = need.urgency / 5;

  // Availability bonus
  const availBonus = volunteer.availability === 'daily' ? 0.1 : volunteer.availability === 'weekdays' ? 0.05 : 0;

  const raw = skillScore * 0.4 + proximityScore * 0.3 + urgencyScore * 0.3 + availBonus;
  return Math.min(Math.round(raw * 100), 99);
}

const skillOptions = ['medical', 'nursing', 'first aid', 'teaching', 'counseling',
  'logistics', 'driving', 'communication', 'construction', 'cooking', 'caregiving',
  'psychology', 'carpentry', 'physical labor', 'sewing', 'crafts'];

const availOptions = ['daily', 'weekdays', 'weekends'];

export default function MatchPage() {
  const [step, setStep] = useState(1); // 1: find needs, 2: configure volunteer, 3: results
  const [selectedNeed, setSelectedNeed] = useState(null);
  const [volunteerProfile, setVolunteerProfile] = useState({
    skills: [],
    district: '',
    availability: 'weekends',
    name: '',
  });
  const [matches, setMatches] = useState([]);
  const [aiExplanations, setAiExplanations] = useState({});
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [accepted, setAccepted] = useState([]);
  const [needSearch, setNeedSearch] = useState('');

  const filteredNeeds = needsData
    .filter(n => n.status === 'open')
    .filter(n => !needSearch || n.title.toLowerCase().includes(needSearch.toLowerCase()) || n.category.toLowerCase().includes(needSearch.toLowerCase()))
    .sort((a, b) => b.urgency - a.urgency);

  const toggleSkill = (skill) => {
    setVolunteerProfile(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const runMatch = () => {
    if (!volunteerProfile.skills.length) return;
    const volunteer = {
      ...volunteerProfile,
      district: volunteerProfile.district || (selectedNeed?.district || 'Mumbai'),
    };
    // Match against all open needs (or selected need context)
    const needsToMatch = selectedNeed ? [selectedNeed, ...needsData.filter(n => n.id !== selectedNeed.id && n.status === 'open')] : needsData.filter(n => n.status === 'open');
    const results = needsToMatch.map(need => ({
      need,
      score: computeMatchScore(volunteer, need),
      matchedSkills: need.skillsRequired.filter(s =>
        volunteerProfile.skills.some(vs => vs.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(vs.toLowerCase()))
      ),
    })).sort((a, b) => b.score - a.score).slice(0, 6);
    setMatches(results);
    setStep(3);
    // Fetch Gemini explanations for top 3 matches asynchronously
    setExplanationLoading(true);
    Promise.all(
      results.slice(0, 3).map(async ({ need, score }) => {
        try {
          const res = await fetch('/api/gemini/explain-match', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ volunteer, need, score: score / 100 }),
          });
          const json = await res.json();
          return { id: need.id, explanation: json.explanation };
        } catch { return { id: need.id, explanation: null }; }
      })
    ).then(results => {
      const map = {};
      results.forEach(r => { if (r.explanation) map[r.id] = r.explanation; });
      setAiExplanations(map);
      setExplanationLoading(false);
    });
  };

  const urgencyColor = (u) => u >= 5 ? 'var(--danger)' : u >= 4 ? '#F97316' : u >= 3 ? 'var(--warning)' : 'var(--accent)';
  const urgencyLabel = (u) => u >= 5 ? 'Critical' : u >= 4 ? 'High' : u >= 3 ? 'Medium' : u >= 2 ? 'Low' : 'Minimal';
  const scoreColor = (s) => s >= 80 ? 'var(--accent-light)' : s >= 60 ? 'var(--warning)' : 'var(--text-secondary)';

  const districts = ['Mumbai', 'Thane', 'Navi Mumbai', 'Pune', 'Other'];

  return (
    <div className="page-wrapper">
      <div className={`container ${styles.pageContainer}`}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <div>
            <div className="section-tag" style={{ display: 'inline-flex', marginBottom: '0.5rem' }}>
              <Zap size={11} /> Smart Matching
            </div>
            <h1 className="heading-xl">Volunteer Match Engine</h1>
            <p className="text-muted" style={{ marginTop: '0.5rem' }}>
              Algorithm matches you to needs based on skill fit × proximity × urgency.
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className={styles.steps}>
          {['Browse Needs', 'Your Profile', 'Matched Results'].map((label, i) => (
            <div key={label} className={`${styles.step} ${step === i + 1 ? styles.stepActive : step > i + 1 ? styles.stepDone : ''}`}>
              <div className={styles.stepCircle}>
                {step > i + 1 ? <CheckCircle size={16} /> : <span>{i + 1}</span>}
              </div>
              <span className={styles.stepLabel}>{label}</span>
              {i < 2 && <div className={`${styles.stepLine} ${step > i + 1 ? styles.stepLineDone : ''}`} />}
            </div>
          ))}
        </div>

        {/* STEP 1: Browse Needs */}
        {step === 1 && (
          <div className={styles.stepContent}>
            <div className={styles.stepIntro}>
              <h2 className="heading-md">Browse Open Needs</h2>
              <p className="text-muted text-sm">Select a specific need to focus your match, or skip to match against all open needs.</p>
            </div>
            <div className={styles.needSearchBar}>
              <Search size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                className={styles.searchInput}
                placeholder="Search by title or category…"
                value={needSearch}
                onChange={e => setNeedSearch(e.target.value)}
              />
            </div>
            <div className={styles.needsGrid}>
              {filteredNeeds.map(need => (
                <div
                  key={need.id}
                  className={`glass-card ${styles.needCard} ${selectedNeed?.id === need.id ? styles.needCardSelected : ''}`}
                  onClick={() => setSelectedNeed(selectedNeed?.id === need.id ? null : need)}
                >
                  <div className={styles.needCardTop}>
                    <span
                      className="badge"
                      style={{
                        background: `rgba(${need.urgency >= 4 ? '239,68,68' : need.urgency >= 3 ? '245,158,11' : '16,185,129'},0.12)`,
                        color: urgencyColor(need.urgency),
                        border: `1px solid rgba(${need.urgency >= 4 ? '239,68,68' : need.urgency >= 3 ? '245,158,11' : '16,185,129'},0.25)`,
                      }}
                    >
                      {urgencyLabel(need.urgency)}
                    </span>
                    {selectedNeed?.id === need.id && <CheckCircle size={18} style={{ color: 'var(--accent-light)' }} />}
                  </div>
                  <h3 className={styles.needCardTitle}>{need.title}</h3>
                  <div className={styles.needCardMeta}>
                    <span><MapPin size={12} /> {need.location.split(',')[0]}</span>
                    <span><Users size={12} /> {need.volunteersNeeded - need.volunteersAssigned} needed</span>
                  </div>
                  <div className={styles.needCardSkills}>
                    {need.skillsRequired.slice(0, 3).map(s => (
                      <span key={s} className="badge badge-muted">{s}</span>
                    ))}
                    {need.skillsRequired.length > 3 && <span className="badge badge-muted">+{need.skillsRequired.length - 3}</span>}
                  </div>
                  <p className={styles.needCardDesc}>{need.description.slice(0, 80)}…</p>
                </div>
              ))}
            </div>
            <div className={styles.stepActions}>
              {selectedNeed && (
                <div className={styles.selectedBanner}>
                  <CheckCircle size={16} />
                  Selected: <strong>{selectedNeed.title}</strong>
                  <button onClick={() => setSelectedNeed(null)} className={styles.clearBtn}><X size={14} /></button>
                </div>
              )}
              <button className="btn btn-primary btn-lg" onClick={() => setStep(2)}>
                {selectedNeed ? 'Match to this need' : 'Match to all needs'}
                <Zap size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Volunteer Profile */}
        {step === 2 && (
          <div className={styles.stepContent}>
            <div className={styles.stepIntro}>
              <h2 className="heading-md">Your Volunteer Profile</h2>
              <p className="text-muted text-sm">Select your skills, location, and availability so the algorithm can find your best matches.</p>
            </div>
            <div className={`glass-card ${styles.profileCard}`}>
              <div className="form-group">
                <label className="form-label">Your Name (optional)</label>
                <input
                  className="form-input"
                  placeholder="e.g. Priya Sharma"
                  value={volunteerProfile.name}
                  onChange={e => setVolunteerProfile(p => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Your District / Area</label>
                <div className={styles.districtGrid}>
                  {districts.map(d => (
                    <button
                      key={d}
                      type="button"
                      className={`${styles.districtBtn} ${volunteerProfile.district === d ? styles.districtBtnActive : ''}`}
                      onClick={() => setVolunteerProfile(p => ({ ...p, district: d }))}
                    >
                      <MapPin size={13} />
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Availability</label>
                <div className={styles.availRow}>
                  {availOptions.map(a => (
                    <button
                      key={a}
                      type="button"
                      className={`${styles.availBtn} ${volunteerProfile.availability === a ? styles.availBtnActive : ''}`}
                      onClick={() => setVolunteerProfile(p => ({ ...p, availability: a }))}
                    >
                      <Clock size={13} />
                      {a.charAt(0).toUpperCase() + a.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">
                  Your Skills <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({volunteerProfile.skills.length} selected)</span>
                </label>
                <div className={styles.skillsGrid}>
                  {skillOptions.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      className={`${styles.skillBtn} ${volunteerProfile.skills.includes(skill) ? styles.skillBtnActive : ''}`}
                      onClick={() => toggleSkill(skill)}
                    >
                      {volunteerProfile.skills.includes(skill) && <CheckCircle size={12} />}
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Match Algorithm Explanation */}
            <div className={`glass-card ${styles.algorithmCard}`}>
              <h3 className={styles.algoTitle}><Zap size={16} /> Matching Algorithm</h3>
              <div className={styles.algoFactors}>
                <div className={styles.algoFactor}>
                  <div className={styles.algoWeight} style={{ color: 'var(--primary-light)' }}>40%</div>
                  <div className={styles.algoName}>Skill Match</div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: '40%' }} /></div>
                </div>
                <div className={styles.algoFactor}>
                  <div className={styles.algoWeight} style={{ color: 'var(--accent-light)' }}>30%</div>
                  <div className={styles.algoName}>Proximity</div>
                  <div className="progress-bar"><div className="progress-fill progress-fill-accent" style={{ width: '30%' }} /></div>
                </div>
                <div className={styles.algoFactor}>
                  <div className={styles.algoWeight} style={{ color: 'var(--warning)' }}>30%</div>
                  <div className={styles.algoName}>Urgency Score</div>
                  <div className="progress-bar"><div className="progress-fill progress-fill-warning" style={{ width: '30%' }} /></div>
                </div>
              </div>
            </div>

            <div className={styles.stepActions}>
              <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
              <button
                className="btn btn-primary btn-lg"
                onClick={runMatch}
                disabled={!volunteerProfile.skills.length}
              >
                <Zap size={16} />
                Run Matching Algorithm
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Results */}
        {step === 3 && (
          <div className={styles.stepContent}>
            <div className={styles.stepIntro}>
              <h2 className="heading-md">Your Top Matches</h2>
              <p className="text-muted text-sm">
                {volunteerProfile.name && <strong>{volunteerProfile.name} · </strong>}
                {volunteerProfile.skills.join(', ')} · {volunteerProfile.district || 'Any location'}
              </p>
            </div>
            <div className={styles.matchesGrid}>
              {matches.map(({ need, score, matchedSkills }) => (
                <div key={need.id} className={`glass-card ${styles.matchCard} ${accepted.includes(need.id) ? styles.matchCardAccepted : ''}`}>
                  <div className={styles.matchCardHeader}>
                    <div className={styles.matchScoreBadge} style={{ color: scoreColor(score) }}>
                      <Zap size={14} />
                      {score}% match
                    </div>
                    {accepted.includes(need.id) && (
                      <span className="badge badge-accent"><CheckCircle size={11} /> Accepted</span>
                    )}
                  </div>
                  <h3 className={styles.matchTitle}>{need.title}</h3>
                  <div className={styles.matchMeta}>
                    <span><MapPin size={12} /> {need.location}</span>
                    <span><Users size={12} /> {need.volunteersNeeded - need.volunteersAssigned} volunteers needed</span>
                    <span style={{ color: urgencyColor(need.urgency) }}>
                      <Star size={12} /> {urgencyLabel(need.urgency)} urgency
                    </span>
                  </div>
                  <p className={styles.matchDesc}>{need.description}</p>
                  {/* Gemini AI explanation */}
                  {(aiExplanations[need.id] || explanationLoading) && (
                    <div className={styles.aiExplain}>
                      <Sparkles size={12} style={{ color: 'var(--teal)', flexShrink: 0 }} />
                      {aiExplanations[need.id]
                        ? <span>{aiExplanations[need.id]}</span>
                        : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Gemini is generating an explanation…</span>
                      }
                    </div>
                  )}
                  <div className={styles.matchSkills}>
                    <span className="text-xs text-muted">Matched skills: </span>
                    {matchedSkills.length > 0
                      ? matchedSkills.map(s => <span key={s} className="badge badge-accent">{s}</span>)
                      : <span className="badge badge-muted">None matched</span>
                    }
                  </div>
                  <div className={styles.matchActions}>
                    <span className="text-xs text-muted">{need.postedBy}</span>
                    <button
                      className={`btn btn-sm ${accepted.includes(need.id) ? 'btn-ghost' : 'btn-accent'}`}
                      onClick={() => setAccepted(prev =>
                        prev.includes(need.id) ? prev.filter(id => id !== need.id) : [...prev, need.id]
                      )}
                    >
                      {accepted.includes(need.id) ? <><X size={13} /> Withdraw</> : <><CheckCircle size={13} /> Accept Task</>}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {accepted.length > 0 && (
              <div className={styles.acceptedSummary}>
                <CheckCircle size={20} style={{ color: 'var(--accent-light)' }} />
                <span>
                  You've accepted <strong>{accepted.length}</strong> task{accepted.length > 1 ? 's' : ''}!
                  View your commitments in the{' '}
                  <a href="/volunteer" style={{ color: 'var(--primary-light)' }}>Volunteer Portal</a>.
                </span>
              </div>
            )}

            <div className={styles.stepActions}>
              <button className="btn btn-ghost" onClick={() => { setStep(1); setSelectedNeed(null); setMatches([]); }}>
                ← Start Over
              </button>
              <button className="btn btn-ghost" onClick={() => setStep(2)}>
                ← Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
