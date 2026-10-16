// ============================================================
// CareerGenie CV Template Engine — Reusable Utilities & Normalizer
// ============================================================

export function normalizeResumeData(resume = {}) {
  // 1. Normalize Education (supports single object or array)
  let rawEdu = [];
  if (Array.isArray(resume.education)) {
    rawEdu = resume.education;
  } else if (Array.isArray(resume.educations)) {
    rawEdu = resume.educations;
  } else if (resume.education && typeof resume.education === 'object') {
    rawEdu = [resume.education];
  }

  const educationList = rawEdu
    .map((edu, idx) => ({
      id: edu.id || idx,
      degree: (edu.degree || '').trim(),
      college: (edu.college || edu.school || edu.university || '').trim(),
      graduationYear: (edu.graduationYear || edu.year || edu.duration || '').trim(),
      cgpa: (edu.cgpa || edu.gpa || edu.score || '').trim(),
      honors: (edu.honors || '').trim(),
    }))
    .filter((e) => e.degree || e.college || e.graduationYear);

  const education = educationList[0] || {
    degree: '',
    college: '',
    graduationYear: '',
    cgpa: '',
  };
  const hasEducation = educationList.length > 0;

  // 2. Normalize Experience
  const rawExp = Array.isArray(resume.experience) ? resume.experience : [];
  const experience = rawExp
    .map((exp, idx) => {
      const rawDesc = (exp.desc || exp.description || '').trim();
      // Split into bullets if multiline or bullet points are present
      const bullets = rawDesc
        ? rawDesc
            .split(/\n|•|;\s+/)
            .map((b) => b.trim())
            .filter((b) => b.length > 0)
        : [];

      return {
        id: exp.id || idx,
        role: (exp.role || exp.title || '').trim(),
        company: (exp.company || exp.organization || '').trim(),
        duration: (exp.duration || exp.dates || '').trim(),
        location: (exp.location || '').trim(),
        desc: rawDesc,
        bullets: bullets.length > 0 ? bullets : [rawDesc],
      };
    })
    .filter((e) => e.role || e.company || e.desc);

  const hasExperience = experience.length > 0;

  // 3. Normalize Projects
  const rawProjects = Array.isArray(resume.projects) ? resume.projects : [];
  const projects = rawProjects
    .map((proj, idx) => {
      const rawTech = proj.tech || proj.technologies || '';
      const techList = Array.isArray(rawTech)
        ? rawTech.map((t) => String(t).trim()).filter(Boolean)
        : String(rawTech)
            .split(/[,/|•]/)
            .map((t) => t.trim())
            .filter(Boolean);

      return {
        id: proj.id || idx,
        name: (proj.name || proj.title || '').trim(),
        tech: Array.isArray(rawTech) ? rawTech.join(', ') : String(rawTech).trim(),
        techList,
        desc: (proj.desc || proj.description || '').trim(),
        github: (proj.github || proj.github_url || '').trim(),
        live: (proj.live || proj.live_url || proj.link || '').trim(),
      };
    })
    .filter((p) => p.name || p.desc);

  const hasProjects = projects.length > 0;

  // 4. Normalize Skills
  const skills = resume.skills || {};
  const skillCategories = [
    { id: 'languages', title: 'Languages', items: skills.languages || [] },
    { id: 'frameworks', title: 'Frameworks & Libraries', items: skills.frameworks || [] },
    { id: 'technical', title: 'Technical Competencies', items: skills.technical || [] },
    { id: 'tools', title: 'Tools & DevOps', items: skills.tools || [] },
    { id: 'soft', title: 'Core Strengths', items: skills.soft || [] },
  ]
    .map((cat) => ({
      ...cat,
      items: Array.isArray(cat.items)
        ? cat.items.map((i) => String(i).trim()).filter(Boolean)
        : [],
    }))
    .filter((cat) => cat.items.length > 0);

  const allSkillsFlat = skillCategories.flatMap((c) => c.items);
  const hasSkills = allSkillsFlat.length > 0;

  // 5. Normalize Contact details
  const contact = {
    email: (resume.email || '').trim(),
    phone: (resume.phone || '').trim(),
    location: (resume.location || '').trim(),
    linkedin: (resume.linkedin || resume.linkedin_url || '').trim(),
    github: (resume.github || resume.github_url || '').trim(),
    website: (resume.website || resume.portfolio || '').trim(),
  };

  const contactList = [
    contact.email && { id: 'email', label: contact.email, type: 'email', icon: '✉' },
    contact.phone && { id: 'phone', label: contact.phone, type: 'phone', icon: '📞' },
    contact.location && { id: 'location', label: contact.location, type: 'location', icon: '📍' },
    contact.linkedin && { id: 'linkedin', label: contact.linkedin.replace(/^https?:\/\//i, ''), type: 'linkedin', icon: '🔗' },
    contact.github && { id: 'github', label: contact.github.replace(/^https?:\/\//i, ''), type: 'github', icon: '💻' },
    contact.website && { id: 'website', label: contact.website.replace(/^https?:\/\//i, ''), type: 'website', icon: '🌐' },
  ].filter(Boolean);

  // 6. Normalize Certifications
  const rawCerts = Array.isArray(resume.certifications) ? resume.certifications : [];
  const certifications = rawCerts
    .map((cert, idx) => {
      if (typeof cert === 'string') {
        return { id: idx, name: cert.trim(), issuer: '', date: '' };
      }
      return {
        id: cert.id || idx,
        name: (cert.name || cert.title || '').trim(),
        issuer: (cert.issuer || cert.organization || '').trim(),
        date: (cert.date || cert.year || '').trim(),
      };
    })
    .filter((c) => c.name);

  const hasCertifications = certifications.length > 0;

  // 7. Normalize Languages
  const rawLangs = Array.isArray(resume.languages) ? resume.languages : [];
  const languages = rawLangs
    .map((lang, idx) => {
      if (typeof lang === 'string') {
        return { id: idx, name: lang.trim(), proficiency: '' };
      }
      return {
        id: lang.id || idx,
        name: (lang.name || lang.language || '').trim(),
        proficiency: (lang.proficiency || lang.level || '').trim(),
      };
    })
    .filter((l) => l.name);

  const hasLanguages = languages.length > 0;

  // 8. Normalize Awards & Honors
  const rawAwards = Array.isArray(resume.awards) ? resume.awards : [];
  const awards = rawAwards
    .map((award, idx) => {
      if (typeof award === 'string') {
        return { id: idx, title: award.trim(), issuer: '', year: '', desc: '' };
      }
      return {
        id: award.id || idx,
        title: (award.title || award.name || '').trim(),
        issuer: (award.issuer || award.organization || '').trim(),
        year: (award.year || award.date || '').trim(),
        desc: (award.desc || award.description || '').trim(),
      };
    })
    .filter((a) => a.title);

  const hasAwards = awards.length > 0;

  // 9. Normalize Publications & Research (Crucial for Academic template)
  const rawPubs = Array.isArray(resume.publications) ? resume.publications : [];
  const publications = rawPubs
    .map((pub, idx) => {
      if (typeof pub === 'string') {
        return { id: idx, title: pub.trim(), publisher: '', year: '', link: '', desc: '' };
      }
      return {
        id: pub.id || idx,
        title: (pub.title || pub.name || '').trim(),
        publisher: (pub.publisher || pub.journal || pub.conference || '').trim(),
        year: (pub.year || pub.date || '').trim(),
        link: (pub.link || pub.doi || '').trim(),
        desc: (pub.desc || pub.description || '').trim(),
      };
    })
    .filter((p) => p.title);

  const hasPublications = publications.length > 0;

  const hasSummary = Boolean(resume.summary?.trim());

  return {
    fullName: resume.fullName?.trim() || (resume.isSample ? 'Alex Thomas' : 'Your Name'),
    targetRole: resume.targetRole?.trim() || (resume.isSample ? 'Frontend Developer' : 'Target Job Title'),
    summary: resume.summary?.trim() || '',
    contact,
    contactList,
    education,
    educationList,
    hasEducation,
    skills,
    skillCategories,
    allSkillsFlat,
    hasSkills,
    projects,
    hasProjects,
    experience,
    hasExperience,
    certifications,
    hasCertifications,
    languages,
    hasLanguages,
    awards,
    hasAwards,
    publications,
    hasPublications,
    hasSummary,
  };
}

/**
 * Converts a 6-digit hex color to rgba with opacity
 */
export function hexToRgba(hex = '#000000', alpha = 1) {
  if (!hex || typeof hex !== 'string') return `rgba(15, 23, 42, ${alpha})`;
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
