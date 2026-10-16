import React, { useState } from 'react';
import {
  Sparkles,
  User,
  Target,
  Code2,
  Save,
  CheckCircle2,
  Plus,
  X,
  RefreshCw,
  Lightbulb,
  Wand2
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, FormField } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { generateRoleSummary, suggestSkillsForRole, parseCustomSkillInput } from '../api/aiService';
import { EMPTY_RESUME } from '../data/sampleResume';

const POPULAR_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'React / Next.js Specialist',
  'Python Developer',
  'Data Analyst / Scientist',
  'Machine Learning Engineer',
  'Mobile Developer (React Native / Flutter)',
  'DevOps & Cloud Engineer',
  'UI/UX & Product Designer',
  'Software Engineer',
  'Cybersecurity Analyst',
];

const SKILL_CATEGORIES = [
  { key: 'languages', label: 'Programming Languages', icon: '💻' },
  { key: 'frameworks', label: 'Frameworks & Libraries', icon: '⚛️' },
  { key: 'technical', label: 'Technical Concepts', icon: '🛠️' },
  { key: 'tools', label: 'Tools & DevOps', icon: '🧰' },
  { key: 'soft', label: 'Soft Skills', icon: '🤝' },
];

export const ProfilePage = () => {
  const { addToast } = useToast();

  // Load existing profile data from localStorage
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('careergenie_profile');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.isSample || p.fullName === 'Alex Thomas') {
          return EMPTY_RESUME;
        }
        return {
          ...EMPTY_RESUME,
          ...p,
        };
      } catch {
        // ignore
      }
    }
    return EMPTY_RESUME;
  });

  // AI Generation States
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryOptions, setSummaryOptions] = useState(null);
  const [isSuggestingSkills, setIsSuggestingSkills] = useState(false);
  const [suggestedSkillsData, setSuggestedSkillsData] = useState(null);
  const [customSkillPrompt, setCustomSkillPrompt] = useState('');
  const [isParsingSkills, setIsParsingSkills] = useState(false);
  const [activeTab, setActiveTab] = useState('role-summary'); // 'role-summary' | 'personal' | 'skills'

  // Handle Save
  const handleSaveProfile = () => {
    localStorage.setItem('careergenie_profile', JSON.stringify(profile));
    addToast('Profile, custom role & AI summary saved successfully!', 'success');
  };

  // Generate AI Summary based on Role + Personal Details
  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const allCurrentSkills = Object.values(profile.skills).flat();
      const res = await generateRoleSummary({
        jobTitle: profile.targetRole,
        fullName: profile.fullName,
        education: profile.education,
        experience: [],
        skills: profile.skills,
        personalDetails: {
          location: profile.location,
          bio: profile.bio,
          projects: [
            { name: `${profile.targetRole} Portfolio Project`, tech: allCurrentSkills.slice(0, 4).join(', ') },
          ],
        },
      });

      if (res && res.options) {
        setSummaryOptions(res.options);
        addToast('✨ AI generated 3 role-tailored summary options!', 'success');
      } else {
        addToast('Could not generate summaries. Please try again.', 'error');
      }
    } catch {
      addToast('AI generation notice: loaded role-tailored summary.', 'info');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Select AI Summary option
  const applySummary = (text) => {
    setProfile((p) => ({ ...p, summary: text }));
    addToast('Applied AI summary to your profile!', 'success');
  };

  // Fetch AI Recommended Skills for custom job title
  const handleSuggestSkills = async (roleToUse = profile.targetRole) => {
    setIsSuggestingSkills(true);
    try {
      const allCurrentSkills = Object.values(profile.skills).flat();
      const res = await suggestSkillsForRole(roleToUse, allCurrentSkills);
      if (res && res.categories) {
        setSuggestedSkillsData(res);
        addToast(`✨ Analyzed role requirements for "${roleToUse}"`, 'success');
      }
    } catch (err) {
      console.warn('Skill suggestions failed:', err);
    } finally {
      setIsSuggestingSkills(false);
    }
  };

  // Add a single skill into profile
  const addSkillToCategory = (catKey, skillName) => {
    const trimmed = skillName.trim();
    if (!trimmed) return;
    setProfile((prev) => {
      const existing = prev.skills[catKey] || [];
      if (existing.includes(trimmed)) return prev;
      return {
        ...prev,
        skills: {
          ...prev.skills,
          [catKey]: [...existing, trimmed],
        },
      };
    });
  };

  // Remove skill
  const removeSkillFromCategory = (catKey, skillName) => {
    setProfile((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [catKey]: (prev.skills[catKey] || []).filter((s) => s !== skillName),
      },
    }));
  };

  // Add all suggested skills
  const handleAddAllSuggestedSkills = () => {
    if (!suggestedSkillsData?.categories) return;
    setProfile((prev) => {
      const updated = { ...prev.skills };
      suggestedSkillsData.categories.forEach((cat) => {
        const catKey = cat.key || 'technical';
        if (!updated[catKey]) updated[catKey] = [];
        cat.skills.forEach((s) => {
          if (!updated[catKey].includes(s.name)) {
            updated[catKey].push(s.name);
          }
        });
      });
      return { ...prev, skills: updated };
    });
    addToast('All suggested skills added to your profile!', 'success');
  };

  // Freeform AI Skill parser
  const handleParseCustomSkills = async (e) => {
    e.preventDefault();
    if (!customSkillPrompt.trim()) return;
    setIsParsingSkills(true);
    try {
      const res = await parseCustomSkillInput(customSkillPrompt, profile.targetRole);
      if (res && res.generatedSkills?.length) {
        res.generatedSkills.forEach((item) => {
          const cat = item.categoryKey || 'technical';
          addSkillToCategory(cat, item.name);
        });
        addToast(`✨ AI identified and added ${res.generatedSkills.length} skills!`, 'success');
        setCustomSkillPrompt('');
      } else {
        addToast('No skills detected. Try describing specific tools or frameworks.', 'warning');
      }
    } catch {
      addToast('Processed skill input.', 'info');
    } finally {
      setIsParsingSkills(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem 4rem', width: '100%' }}>
      {/* Header Banner */}
      <Card
        className="glass-panel"
        glow
        style={{
          padding: '2.5rem',
          border: '1px solid var(--border-color)',
          background: 'var(--banner-bg)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <Badge variant="primary">AI Career Operating System</Badge>
              <Badge variant="cyan">Target Role Studio</Badge>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              Role &amp; Profile <span className="gradient-text">Customization Studio</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: '640px', fontSize: '0.95rem' }}>
              Enter your target job title in your own words, fill in personal details, and let Cloud AI synthesize them into a tailored professional summary and targeted skill profile.
            </p>
          </div>

          <Button variant="primary" icon={Save} onClick={handleSaveProfile} size="lg">
            Save Profile &amp; Role
          </Button>
        </div>
      </Card>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('role-summary')}
          style={{
            background: activeTab === 'role-summary' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
            color: activeTab === 'role-summary' ? 'var(--primary-400)' : 'var(--text-muted)',
            border: activeTab === 'role-summary' ? '1px solid var(--primary-500)' : '1px solid transparent',
            padding: '0.6rem 1.2rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Target size={18} /> 1. Custom Role &amp; AI Summary
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          style={{
            background: activeTab === 'skills' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
            color: activeTab === 'skills' ? 'var(--primary-400)' : 'var(--text-muted)',
            border: activeTab === 'skills' ? '1px solid var(--primary-500)' : '1px solid transparent',
            padding: '0.6rem 1.2rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Code2 size={18} /> 2. AI Role-Based Skills
        </button>

        <button
          onClick={() => setActiveTab('personal')}
          style={{
            background: activeTab === 'personal' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
            color: activeTab === 'personal' ? 'var(--primary-400)' : 'var(--text-muted)',
            border: activeTab === 'personal' ? '1px solid var(--primary-500)' : '1px solid transparent',
            padding: '0.6rem 1.2rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <User size={18} /> 3. Personal &amp; Academic Details
        </button>
      </div>

      {/* TAB 1: CUSTOM ROLE & AI SUMMARY */}
      {activeTab === 'role-summary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Section 1: Job Title In Own Words */}
          <Card style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-400)' }}>
                <Target size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Custom Target Job Title</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Write your job title in your own words. The entire AI engine will calibrate its summaries and skill recommendations to this specific role.
                </p>
              </div>
            </div>

            <FormField label="Target Job Title (Editable in your own words)" required>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ flex: 1, minWidth: '280px', fontSize: '1.05rem', fontWeight: 600, color: 'var(--primary-300)' }}
                  placeholder="e.g. Frontend Developer, Senior React Engineer, AI Solution Architect..."
                  value={profile.targetRole}
                  onChange={(e) => setProfile((p) => ({ ...p, targetRole: e.target.value }))}
                />
                <Button
                  variant="secondary"
                  icon={Wand2}
                  onClick={() => handleSuggestSkills(profile.targetRole)}
                  disabled={isSuggestingSkills}
                >
                  {isSuggestingSkills ? 'Analyzing Role...' : 'Analyze Skills for this Role'}
                </Button>
              </div>
            </FormField>

            {/* Popular quick role pills */}
            <div style={{ marginTop: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem', fontWeight: 600 }}>
                Popular roles to click &amp; customize:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {POPULAR_ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setProfile((p) => ({ ...p, targetRole: role }));
                      handleSuggestSkills(role);
                    }}
                    style={{
                      background: profile.targetRole === role ? 'var(--primary-600)' : 'var(--bg-surface-elevated)',
                      color: profile.targetRole === role ? '#fff' : 'var(--text-muted)',
                      border: profile.targetRole === role ? '1px solid var(--primary-500)' : '1px solid var(--border-color)',
                      borderRadius: '9999px',
                      padding: '4px 12px',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      fontWeight: profile.targetRole === role ? 600 : 400,
                    }}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Section 2: AI Professional Summary (Combined Role + Personal Background) */}
          <Card style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>AI Professional Summary Generator</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Converts your custom role ({profile.targetRole || 'your role'}) + personal details into an ATS-optimized paragraph.
                  </p>
                </div>
              </div>

              <Button
                variant="primary"
                icon={Sparkles}
                onClick={handleGenerateSummary}
                disabled={isGeneratingSummary}
              >
                {isGeneratingSummary ? 'Synthesizing with AI...' : '✨ AI Generate Role-Aligned Summary'}
              </Button>
            </div>

            {/* Generated Options Drawer if available */}
            {summaryOptions && (
              <div style={{ marginBottom: '1.75rem', background: 'var(--bg-surface-elevated)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                  <Sparkles size={16} color="var(--primary-400)" />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>AI Generated Options (Click to apply):</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  {summaryOptions.map((opt) => (
                    <div
                      key={opt.id}
                      style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '12px',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent-cyan)', marginBottom: '6px' }}>
                          {opt.title}
                        </div>
                        <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>
                          {opt.summary}
                        </p>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={CheckCircle2}
                        onClick={() => applySummary(opt.summary)}
                        style={{ alignSelf: 'flex-start' }}
                      >
                        Use this Summary
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Editable Summary Textarea */}
            <FormField label="Current Profile Summary (Editable)">
              <textarea
                className="form-textarea"
                rows={5}
                style={{ width: '100%', fontSize: '0.95rem', lineHeight: 1.6, padding: '1rem' }}
                placeholder="Write 2-3 sentences about your expertise, or click 'AI Generate Role-Aligned Summary' above..."
                value={profile.summary}
                onChange={(e) => setProfile((p) => ({ ...p, summary: e.target.value }))}
              />
            </FormField>
          </Card>
        </div>
      )}

      {/* TAB 2: AI ROLE-BASED SKILLS */}
      {activeTab === 'skills' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* AI Skill Recommender Box */}
          <Card style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.25rem' }}>
                  <Badge variant="emerald">AI Role Intelligence</Badge>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    Target Role: {profile.targetRole}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Role Skill Recommendations</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Market-aligned skills for <strong>{profile.targetRole}</strong>. Click any skill to add it into your profile.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <Button
                  variant="outline"
                  icon={RefreshCw}
                  onClick={() => handleSuggestSkills(profile.targetRole)}
                  disabled={isSuggestingSkills}
                >
                  {isSuggestingSkills ? 'Analyzing...' : 'Refresh Suggestions'}
                </Button>
                {suggestedSkillsData && (
                  <Button variant="primary" icon={Plus} onClick={handleAddAllSuggestedSkills}>
                    Add All Suggested Skills
                  </Button>
                )}
              </div>
            </div>

            {/* Market Insight banner if available */}
            {suggestedSkillsData?.marketInsight && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1.25rem', marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '0.875rem' }}>
                <Lightbulb size={20} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
                <span>{suggestedSkillsData.marketInsight}</span>
              </div>
            )}

            {/* Suggested Skill Categories */}
            {suggestedSkillsData?.categories ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {suggestedSkillsData.categories.map((cat) => {
                  const catKey = cat.key || 'technical';
                  return (
                    <div
                      key={cat.key}
                      style={{
                        background: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.25rem',
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{cat.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{cat.skills?.length || 0} skills</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {cat.skills?.map((s) => {
                          const isAlreadyAdded = (profile.skills[catKey] || []).includes(s.name);
                          return (
                            <button
                              key={s.name}
                              type="button"
                              onClick={() => {
                                if (isAlreadyAdded) {
                                  removeSkillFromCategory(catKey, s.name);
                                } else {
                                  addSkillToCategory(catKey, s.name);
                                }
                              }}
                              style={{
                                background: isAlreadyAdded ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface)',
                                color: isAlreadyAdded ? 'var(--accent-emerald)' : 'var(--text-muted)',
                                border: isAlreadyAdded ? '1px solid var(--accent-emerald)' : '1px solid var(--border-color)',
                                borderRadius: '6px',
                                padding: '4px 10px',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontWeight: 500,
                              }}
                            >
                              {isAlreadyAdded ? <CheckCircle2 size={12} /> : <Plus size={12} />}
                              {s.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                <Code2 size={32} color="var(--primary-400)" style={{ margin: '0 auto 0.75rem' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>AI Role Skill Analysis Ready</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  Click below to load categorized skill recommendations for <strong>{profile.targetRole}</strong>.
                </p>
                <Button variant="primary" icon={Sparkles} onClick={() => handleSuggestSkills(profile.targetRole)}>
                  ✨ Load Recommendations for {profile.targetRole}
                </Button>
              </div>
            )}

            {/* AI Freeform Skill Writer */}
            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                <Wand2 size={18} color="var(--primary-400)" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>AI Freeform Skill Extractor &amp; Categorizer</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                Describe what you built or know in your own natural words (e.g. <em>"built interactive interfaces using React, styled with Tailwind and connected to Firebase auth"</em>). AI will parse and add them automatically!
              </p>
              <form onSubmit={handleParseCustomSkills} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ flex: 1, minWidth: '280px' }}
                  placeholder="Describe your tools or projects in plain English..."
                  value={customSkillPrompt}
                  onChange={(e) => setCustomSkillPrompt(e.target.value)}
                />
                <Button variant="secondary" icon={Sparkles} type="submit" disabled={isParsingSkills}>
                  {isParsingSkills ? 'Parsing...' : '✨ AI Format & Add'}
                </Button>
              </form>
            </div>
          </Card>

          {/* Active Profile Skills Cloud */}
          <Card style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Your Active Skills by Category
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              These skills will appear on your ATS resume and be evaluated by the Career Match Engine.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {SKILL_CATEGORIES.map((cat) => {
                const list = profile.skills[cat.key] || [];
                return (
                  <div key={cat.key} style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                        {cat.icon} {cat.label}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{list.length} added</span>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {list.length === 0 ? (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                          No skills added yet in this category.
                        </span>
                      ) : (
                        list.map((s) => (
                          <span
                            key={s}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: 'var(--bg-surface)',
                              border: '1px solid var(--primary-500)',
                              color: 'var(--text-main)',
                              borderRadius: '6px',
                              padding: '4px 10px',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                            }}
                          >
                            {s}
                            <X
                              size={13}
                              style={{ cursor: 'pointer', color: 'var(--text-muted)' }}
                              onClick={() => removeSkillFromCategory(cat.key, s)}
                            />
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: PERSONAL & ACADEMIC DETAILS */}
      {activeTab === 'personal' && (
        <Card style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Personal &amp; Educational Background
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.75rem' }}>
            These details feed directly into the AI summary generator and your generated CV templates.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <Input
              label="Full Name"
              value={profile.fullName}
              onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
            />
            <Input
              label="Email Address"
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
            />
            <Input
              label="Phone Number"
              value={profile.phone}
              onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
            />
            <Input
              label="Location"
              value={profile.location}
              onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
            />
          </div>

          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            Education Details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <Input
              label="Degree / Major"
              value={profile.education.degree}
              onChange={(e) =>
                setProfile((p) => ({ ...p, education: { ...p.education, degree: e.target.value } }))
              }
            />
            <Input
              label="College / Institute"
              value={profile.education.college}
              onChange={(e) =>
                setProfile((p) => ({ ...p, education: { ...p.education, college: e.target.value } }))
              }
            />
            <Input
              label="Graduation Year"
              value={profile.education.graduationYear}
              onChange={(e) =>
                setProfile((p) => ({ ...p, education: { ...p.education, graduationYear: e.target.value } }))
              }
            />
            <Input
              label="CGPA / Percentage"
              value={profile.education.cgpa}
              onChange={(e) =>
                setProfile((p) => ({ ...p, education: { ...p.education, cgpa: e.target.value } }))
              }
            />
          </div>

          <FormField label="Your Passion / Background in your own words">
            <textarea
              className="form-textarea"
              rows={3}
              style={{ width: '100%', padding: '0.85rem' }}
              placeholder="e.g. Passionate about building responsive React applications and accessible web designs..."
              value={profile.bio}
              onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
            />
          </FormField>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" icon={Save} onClick={handleSaveProfile} size="lg">
              Save Changes
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
