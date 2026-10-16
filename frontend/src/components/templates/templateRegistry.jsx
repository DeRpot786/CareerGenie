import React from 'react';
import { ProfessionalClassicTemplate } from './ProfessionalClassicTemplate';
import { ModernTwoColumnTemplate } from './ModernTwoColumnTemplate';
import { MinimalistTemplate } from './MinimalistTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { CreativeTemplate } from './CreativeTemplate';
import { AtsFriendlyTemplate } from './AtsFriendlyTemplate';
import { ModernSidebarTemplate } from './ModernSidebarTemplate';
import { AcademicTemplate } from './AcademicTemplate';

// 8 Visually and Structurally Genuinely Different Templates
export const TEMPLATE_REGISTRY = [
  {
    id: 'professional-classic',
    name: 'Professional Classic',
    category: 'Traditional & Corporate',
    description: 'Traditional single-column layout with centered formal headers, subtle divider lines, and conventional sections. Ideal for corporate and traditional employers.',
    accent: '#0f172a',
    component: ProfessionalClassicTemplate,
    renderThumbnail: (isSelected) => (
      <svg width="72" height="96" viewBox="0 0 72 96" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: '4px', border: isSelected ? '1.5px solid #6366f1' : '1px solid #cbd5e1' }}>
        <rect width="72" height="96" fill="#ffffff" />
        {/* Centered Traditional Header */}
        <rect x="20" y="7" width="32" height="3.5" rx="0.5" fill="#0f172a" />
        <rect x="25" y="12" width="22" height="2" rx="0.5" fill="#64748b" />
        <rect x="14" y="15.5" width="44" height="1.5" rx="0.5" fill="#94a3b8" />
        <line x1="8" y1="19" x2="64" y2="19" stroke="#0f172a" strokeWidth="1" />
        {/* Summary */}
        <rect x="8" y="22" width="24" height="2" rx="0.5" fill="#0f172a" />
        <line x1="8" y1="25.5" x2="64" y2="25.5" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x="8" y="28" width="56" height="1.5" rx="0.5" fill="#475569" />
        <rect x="8" y="31" width="48" height="1.5" rx="0.5" fill="#94a3b8" />
        {/* Experience */}
        <rect x="8" y="36" width="22" height="2" rx="0.5" fill="#0f172a" />
        <line x1="8" y1="39.5" x2="64" y2="39.5" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x="8" y="42" width="30" height="2" rx="0.5" fill="#334155" />
        <rect x="52" y="42" width="12" height="1.5" rx="0.5" fill="#94a3b8" />
        <rect x="12" y="45.5" width="50" height="1.5" rx="0.5" fill="#64748b" />
        <rect x="12" y="48.5" width="44" height="1.5" rx="0.5" fill="#64748b" />
        {/* Education */}
        <rect x="8" y="54" width="18" height="2" rx="0.5" fill="#0f172a" />
        <line x1="8" y1="57.5" x2="64" y2="57.5" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x="8" y="60" width="34" height="2" rx="0.5" fill="#334155" />
        <rect x="8" y="63.5" width="26" height="1.5" rx="0.5" fill="#64748b" />
        {/* Skills */}
        <rect x="8" y="69" width="16" height="2" rx="0.5" fill="#0f172a" />
        <line x1="8" y1="72.5" x2="64" y2="72.5" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x="8" y="75" width="56" height="1.5" rx="0.5" fill="#475569" />
        {/* Projects */}
        <rect x="8" y="80" width="16" height="2" rx="0.5" fill="#0f172a" />
        <line x1="8" y1="83.5" x2="64" y2="83.5" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x="8" y="86" width="36" height="2" rx="0.5" fill="#334155" />
        <rect x="8" y="89.5" width="52" height="1.5" rx="0.5" fill="#64748b" />
      </svg>
    ),
  },
  {
    id: 'modern-two-column',
    name: 'Modern Two-Column',
    category: 'Modern Split Layout',
    description: 'Top header banner with balanced split: 66% main column for profile, experience & projects, and 34% secondary sidebar for skills, contact & credentials.',
    accent: '#2563eb',
    component: ModernTwoColumnTemplate,
    renderThumbnail: (isSelected) => (
      <svg width="72" height="96" viewBox="0 0 72 96" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: '4px', border: isSelected ? '1.5px solid #6366f1' : '1px solid #cbd5e1' }}>
        <rect width="72" height="96" fill="#ffffff" />
        {/* Full-width top header */}
        <rect x="6" y="6" width="30" height="3.5" rx="0.5" fill="#0f172a" />
        <rect x="6" y="11" width="18" height="2" rx="0.5" fill="#2563eb" />
        <rect x="46" y="6" width="20" height="1.5" rx="0.5" fill="#94a3b8" />
        <rect x="46" y="9" width="20" height="1.5" rx="0.5" fill="#94a3b8" />
        <line x1="6" y1="16" x2="66" y2="16" stroke="#2563eb" strokeWidth="1" />
        {/* 2-Column Split Body */}
        {/* Main Column (Left 66%) */}
        <rect x="6" y="20" width="20" height="2" rx="0.5" fill="#2563eb" />
        <rect x="6" y="23.5" width="38" height="1.5" rx="0.5" fill="#475569" />
        <rect x="6" y="26.5" width="32" height="1.5" rx="0.5" fill="#94a3b8" />
        <rect x="6" y="32" width="22" height="2" rx="0.5" fill="#2563eb" />
        <rect x="6" y="35.5" width="26" height="2" rx="0.5" fill="#0f172a" />
        <rect x="6" y="39" width="38" height="1.5" rx="0.5" fill="#64748b" />
        <rect x="6" y="42" width="34" height="1.5" rx="0.5" fill="#64748b" />
        <rect x="6" y="47.5" width="24" height="2" rx="0.5" fill="#0f172a" />
        <rect x="6" y="51" width="36" height="1.5" rx="0.5" fill="#64748b" />
        <rect x="6" y="57" width="18" height="2" rx="0.5" fill="#2563eb" />
        <rect x="6" y="60.5" width="30" height="2" rx="0.5" fill="#0f172a" />
        <rect x="6" y="64" width="38" height="1.5" rx="0.5" fill="#64748b" />
        {/* Secondary Sidebar (Right 34%) */}
        <line x1="47" y1="18" x2="47" y2="92" stroke="#e2e8f0" strokeWidth="0.75" />
        <rect x="50" y="20" width="14" height="2" rx="0.5" fill="#2563eb" />
        <rect x="50" y="24" width="16" height="1.5" rx="0.5" fill="#64748b" />
        <rect x="50" y="27" width="16" height="1.5" rx="0.5" fill="#64748b" />
        <rect x="50" y="34" width="14" height="2" rx="0.5" fill="#2563eb" />
        <rect x="50" y="38" width="8" height="2.5" rx="1" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x="59" y="38" width="7" height="2.5" rx="1" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x="50" y="42" width="9" height="2.5" rx="1" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x="60" y="42" width="6" height="2.5" rx="1" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x="50" y="49" width="16" height="2" rx="0.5" fill="#2563eb" />
        <rect x="50" y="53" width="16" height="1.5" rx="0.5" fill="#64748b" />
        <rect x="50" y="60" width="14" height="2" rx="0.5" fill="#2563eb" />
        <rect x="50" y="64" width="16" height="1.5" rx="0.5" fill="#64748b" />
      </svg>
    ),
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    category: 'Clean & Typography-Led',
    description: 'Clean single-column design with generous whitespace, delicate hairline dividers, simple typography, and no decorative box fills.',
    accent: '#334155',
    component: MinimalistTemplate,
    renderThumbnail: (isSelected) => (
      <svg width="72" height="96" viewBox="0 0 72 96" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: '4px', border: isSelected ? '1.5px solid #6366f1' : '1px solid #cbd5e1' }}>
        <rect width="72" height="96" fill="#ffffff" />
        {/* Left Aligned Clean Header */}
        <rect x="10" y="8" width="28" height="3" rx="0.5" fill="#0f172a" />
        <rect x="10" y="13" width="16" height="1.5" rx="0.5" fill="#334155" />
        <rect x="10" y="17" width="40" height="1" rx="0.5" fill="#94a3b8" />
        {/* Section 1: Summary */}
        <rect x="10" y="24" width="18" height="1.5" rx="0.5" fill="#64748b" />
        <line x1="10" y1="27" x2="62" y2="27" stroke="#e2e8f0" strokeWidth="0.5" />
        <rect x="10" y="30" width="52" height="1" rx="0.5" fill="#475569" />
        <rect x="10" y="33" width="44" height="1" rx="0.5" fill="#64748b" />
        {/* Section 2: Experience */}
        <rect x="10" y="40" width="20" height="1.5" rx="0.5" fill="#64748b" />
        <line x1="10" y1="43" x2="62" y2="43" stroke="#e2e8f0" strokeWidth="0.5" />
        <rect x="10" y="46" width="26" height="1.5" rx="0.5" fill="#0f172a" />
        <rect x="10" y="49.5" width="48" height="1" rx="0.5" fill="#64748b" />
        <rect x="10" y="52" width="42" height="1" rx="0.5" fill="#94a3b8" />
        {/* Section 3: Education */}
        <rect x="10" y="59" width="18" height="1.5" rx="0.5" fill="#64748b" />
        <line x1="10" y1="62" x2="62" y2="62" stroke="#e2e8f0" strokeWidth="0.5" />
        <rect x="10" y="65" width="28" height="1.5" rx="0.5" fill="#0f172a" />
        <rect x="10" y="68" width="20" height="1" rx="0.5" fill="#64748b" />
        {/* Section 4: Skills */}
        <rect x="10" y="75" width="14" height="1.5" rx="0.5" fill="#64748b" />
        <line x1="10" y1="78" x2="62" y2="78" stroke="#e2e8f0" strokeWidth="0.5" />
        <rect x="10" y="81" width="52" height="1" rx="0.5" fill="#475569" />
        <rect x="10" y="84" width="40" height="1" rx="0.5" fill="#64748b" />
      </svg>
    ),
  },
  {
    id: 'executive',
    name: 'Executive',
    category: 'Leadership & Architecture',
    description: 'Commanding top accent bar, split executive header, prominent leadership summary, and 3-column competency matrix for seasoned leaders.',
    accent: '#0369a1',
    component: ExecutiveTemplate,
    renderThumbnail: (isSelected) => (
      <svg width="72" height="96" viewBox="0 0 72 96" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: '4px', border: isSelected ? '1.5px solid #6366f1' : '1px solid #cbd5e1' }}>
        <rect width="72" height="96" fill="#ffffff" />
        {/* Executive top accent bar */}
        <rect x="0" y="0" width="72" height="2.5" fill="#0369a1" />
        {/* Split top header */}
        <rect x="8" y="7" width="28" height="3.5" rx="0.5" fill="#0f172a" />
        <rect x="8" y="12" width="20" height="2" rx="0.5" fill="#0369a1" />
        <rect x="48" y="7" width="16" height="1.5" rx="0.5" fill="#64748b" />
        <rect x="48" y="10" width="16" height="1.5" rx="0.5" fill="#64748b" />
        <line x1="8" y1="16" x2="64" y2="16" stroke="#0369a1" strokeWidth="1" />
        {/* Executive Summary callout box */}
        <rect x="8" y="19" width="56" height="11" rx="1" fill="#f0f9ff" />
        <line x1="8" y1="19" x2="8" y2="30" stroke="#0369a1" strokeWidth="1.5" />
        <rect x="12" y="22" width="22" height="1.5" rx="0.5" fill="#0369a1" />
        <rect x="12" y="25" width="48" height="1.5" rx="0.5" fill="#475569" />
        {/* 3-column micro grid for competencies */}
        <rect x="8" y="34" width="17" height="9" rx="1.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x="27" y="34" width="18" height="9" rx="1.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x="47" y="34" width="17" height="9" rx="1.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.5" />
        {/* Experience */}
        <rect x="8" y="46" width="30" height="2" rx="0.5" fill="#0369a1" />
        <line x1="8" y1="49.5" x2="64" y2="49.5" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x="8" y="52" width="28" height="2" rx="0.5" fill="#0f172a" />
        <rect x="8" y="55.5" width="56" height="1.5" rx="0.5" fill="#64748b" />
        <rect x="8" y="58.5" width="50" height="1.5" rx="0.5" fill="#94a3b8" />
        {/* Projects with left accent line */}
        <rect x="8" y="65" width="28" height="2" rx="0.5" fill="#0369a1" />
        <line x1="8" y1="68.5" x2="64" y2="68.5" stroke="#cbd5e1" strokeWidth="0.5" />
        <line x1="8" y1="71" x2="8" y2="82" stroke="#0369a1" strokeWidth="1.5" />
        <rect x="12" y="72" width="24" height="2" rx="0.5" fill="#0f172a" />
        <rect x="12" y="75.5" width="50" height="1.5" rx="0.5" fill="#64748b" />
      </svg>
    ),
  },
  {
    id: 'creative',
    name: 'Creative',
    category: 'Design & Visual Media',
    description: 'Distinctive display typography, stylized role pill, editorial quote summary, 2-column project showcase cards, and timeline accents.',
    accent: '#e11d48',
    component: CreativeTemplate,
    renderThumbnail: (isSelected) => (
      <svg width="72" height="96" viewBox="0 0 72 96" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: '4px', border: isSelected ? '1.5px solid #6366f1' : '1px solid #cbd5e1' }}>
        <rect width="72" height="96" fill="#ffffff" />
        {/* Pill role and large bold name */}
        <rect x="8" y="6" width="16" height="3" rx="1.5" fill="#ffe4e6" stroke="#e11d48" strokeWidth="0.5" />
        <rect x="8" y="11" width="34" height="4.5" rx="0.5" fill="#0f172a" />
        <line x1="8" y1="18" x2="64" y2="18" stroke="#e11d48" strokeWidth="1.5" />
        {/* Quote summary block */}
        <rect x="8" y="21" width="56" height="10" rx="1" fill="#f8fafc" />
        <line x1="8" y1="21" x2="8" y2="31" stroke="#e11d48" strokeWidth="2" />
        <rect x="12" y="23.5" width="48" height="1.5" rx="0.5" fill="#64748b" />
        <rect x="12" y="26.5" width="40" height="1.5" rx="0.5" fill="#94a3b8" />
        {/* 2x2 Project Cards */}
        <rect x="8" y="34" width="26" height="15" rx="1.5" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.75" />
        <rect x="11" y="36.5" width="14" height="1.5" rx="0.5" fill="#0f172a" />
        <rect x="11" y="40" width="8" height="2" rx="0.5" fill="#ffe4e6" />
        <rect x="11" y="44" width="20" height="1" rx="0.5" fill="#64748b" />
        <rect x="38" y="34" width="26" height="15" rx="1.5" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.75" />
        <rect x="41" y="36.5" width="16" height="1.5" rx="0.5" fill="#0f172a" />
        <rect x="41" y="40" width="9" height="2" rx="0.5" fill="#ffe4e6" />
        <rect x="41" y="44" width="20" height="1" rx="0.5" fill="#64748b" />
        {/* Experience Timeline */}
        <line x1="10" y1="54" x2="10" y2="82" stroke="#e11d48" strokeWidth="1" />
        <circle cx="10" cy="58" r="1.5" fill="#e11d48" />
        <rect x="14" y="57" width="24" height="2" rx="0.5" fill="#0f172a" />
        <rect x="14" y="60.5" width="48" height="1.5" rx="0.5" fill="#64748b" />
        <circle cx="10" cy="69" r="1.5" fill="#e11d48" />
        <rect x="14" y="68" width="20" height="2" rx="0.5" fill="#0f172a" />
        <rect x="14" y="71.5" width="48" height="1.5" rx="0.5" fill="#64748b" />
      </svg>
    ),
  },
  {
    id: 'ats-friendly',
    name: 'ATS-Friendly',
    category: '100% Machine Parsable',
    description: 'Strict single-column text layout with standard all-caps headings and pure linear order. Zero tables, sidebars, or icons for maximum ATS pass rates.',
    accent: '#000000',
    component: AtsFriendlyTemplate,
    renderThumbnail: (isSelected) => (
      <svg width="72" height="96" viewBox="0 0 72 96" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: '4px', border: isSelected ? '1.5px solid #6366f1' : '1px solid #cbd5e1' }}>
        <rect width="72" height="96" fill="#ffffff" />
        {/* Left aligned pure black header */}
        <rect x="8" y="8" width="34" height="3.5" rx="0.5" fill="#000000" />
        <rect x="8" y="13" width="22" height="2" rx="0.5" fill="#333333" />
        <rect x="8" y="17" width="48" height="1.5" rx="0.5" fill="#666666" />
        {/* SECTION 1: SUMMARY */}
        <rect x="8" y="22" width="28" height="2" rx="0.5" fill="#000000" />
        <line x1="8" y1="25.5" x2="64" y2="25.5" stroke="#000000" strokeWidth="0.75" />
        <rect x="8" y="28" width="56" height="1.5" rx="0.5" fill="#444444" />
        <rect x="8" y="31" width="52" height="1.5" rx="0.5" fill="#444444" />
        {/* SECTION 2: SKILLS */}
        <rect x="8" y="36" width="26" height="2" rx="0.5" fill="#000000" />
        <line x1="8" y1="39.5" x2="64" y2="39.5" stroke="#000000" strokeWidth="0.75" />
        <rect x="8" y="42" width="56" height="1.5" rx="0.5" fill="#555555" />
        {/* SECTION 3: EXPERIENCE */}
        <rect x="8" y="48" width="30" height="2" rx="0.5" fill="#000000" />
        <line x1="8" y1="51.5" x2="64" y2="51.5" stroke="#000000" strokeWidth="0.75" />
        <rect x="8" y="54" width="26" height="2" rx="0.5" fill="#000000" />
        <rect x="8" y="57.5" width="56" height="1.5" rx="0.5" fill="#555555" />
        <rect x="8" y="60.5" width="48" height="1.5" rx="0.5" fill="#555555" />
        {/* SECTION 4: PROJECTS */}
        <rect x="8" y="66" width="22" height="2" rx="0.5" fill="#000000" />
        <line x1="8" y1="69.5" x2="64" y2="69.5" stroke="#000000" strokeWidth="0.75" />
        <rect x="8" y="72" width="28" height="2" rx="0.5" fill="#000000" />
        <rect x="8" y="75.5" width="54" height="1.5" rx="0.5" fill="#555555" />
        {/* SECTION 5: EDUCATION */}
        <rect x="8" y="81" width="24" height="2" rx="0.5" fill="#000000" />
        <line x1="8" y1="84.5" x2="64" y2="84.5" stroke="#000000" strokeWidth="0.75" />
        <rect x="8" y="87" width="32" height="2" rx="0.5" fill="#000000" />
      </svg>
    ),
  },
  {
    id: 'modern-sidebar',
    name: 'Modern Sidebar',
    category: 'Vertical Panel Layout',
    description: 'Visually distinct shaded vertical sidebar for contact, avatar, skills, and education, paired with an open main area for experience and projects.',
    accent: '#0f766e',
    component: ModernSidebarTemplate,
    renderThumbnail: (isSelected) => (
      <svg width="72" height="96" viewBox="0 0 72 96" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: '4px', border: isSelected ? '1.5px solid #6366f1' : '1px solid #cbd5e1' }}>
        <rect width="72" height="96" fill="#ffffff" />
        {/* Left Shaded Sidebar (32%) */}
        <rect x="0" y="0" width="24" height="96" fill="#f1f5f9" />
        <line x1="24" y1="0" x2="24" y2="96" stroke="#cbd5e1" strokeWidth="0.75" />
        {/* Avatar Monogram */}
        <rect x="5" y="7" width="14" height="14" rx="2" fill="#0f766e" />
        {/* Contact in sidebar */}
        <rect x="4" y="25" width="16" height="2" rx="0.5" fill="#0f766e" />
        <rect x="4" y="29" width="14" height="1.5" rx="0.5" fill="#64748b" />
        <rect x="4" y="32" width="15" height="1.5" rx="0.5" fill="#64748b" />
        {/* Skills in sidebar */}
        <rect x="4" y="40" width="16" height="2" rx="0.5" fill="#0f766e" />
        <rect x="4" y="44" width="7" height="2.5" rx="0.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x="12" y="44" width="8" height="2.5" rx="0.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x="4" y="48" width="10" height="2.5" rx="0.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x="15" y="48" width="5" height="2.5" rx="0.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" />
        {/* Education in sidebar */}
        <rect x="4" y="58" width="16" height="2" rx="0.5" fill="#0f766e" />
        <rect x="4" y="62" width="15" height="1.5" rx="0.5" fill="#334155" />
        <rect x="4" y="65" width="12" height="1.5" rx="0.5" fill="#64748b" />
        {/* Main Content (Right 68%) */}
        <rect x="28" y="7" width="28" height="4" rx="0.5" fill="#0f172a" />
        <rect x="28" y="13" width="18" height="2" rx="0.5" fill="#0f766e" />
        <line x1="28" y1="17" x2="68" y2="17" stroke="#0f766e" strokeWidth="1" />
        {/* Summary */}
        <rect x="28" y="21" width="16" height="2" rx="0.5" fill="#0f766e" />
        <rect x="28" y="25" width="39" height="1.5" rx="0.5" fill="#475569" />
        <rect x="28" y="28" width="34" height="1.5" rx="0.5" fill="#94a3b8" />
        {/* Experience */}
        <rect x="28" y="36" width="22" height="2" rx="0.5" fill="#0f766e" />
        <rect x="28" y="40" width="26" height="2" rx="0.5" fill="#0f172a" />
        <rect x="28" y="43.5" width="38" height="1.5" rx="0.5" fill="#64748b" />
        <rect x="28" y="46.5" width="34" height="1.5" rx="0.5" fill="#64748b" />
        {/* Projects */}
        <rect x="28" y="56" width="18" height="2" rx="0.5" fill="#0f766e" />
        <rect x="28" y="60" width="28" height="2" rx="0.5" fill="#0f172a" />
        <rect x="28" y="63.5" width="38" height="1.5" rx="0.5" fill="#64748b" />
      </svg>
    ),
  },
  {
    id: 'academic',
    name: 'Academic',
    category: 'Research & Higher Ed',
    description: 'Curriculum Vitae structure placing Education first, followed by research experience, publications, projects, and scholarly citations.',
    accent: '#1e3a8a',
    component: AcademicTemplate,
    renderThumbnail: (isSelected) => (
      <svg width="72" height="96" viewBox="0 0 72 96" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: '4px', border: isSelected ? '1.5px solid #6366f1' : '1px solid #cbd5e1' }}>
        <rect width="72" height="96" fill="#ffffff" />
        {/* Centered Scholarly Header */}
        <rect x="18" y="7" width="36" height="3.5" rx="0.5" fill="#0f172a" />
        <rect x="22" y="12" width="28" height="2" rx="0.5" fill="#1e3a8a" />
        <rect x="14" y="15.5" width="44" height="1.5" rx="0.5" fill="#64748b" />
        <line x1="8" y1="19" x2="64" y2="19" stroke="#1e3a8a" strokeWidth="1" />
        {/* 1. Education FIRST */}
        <rect x="8" y="23" width="22" height="2" rx="0.5" fill="#1e3a8a" />
        <line x1="8" y1="26.5" x2="64" y2="26.5" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x="8" y="29" width="32" height="2" rx="0.5" fill="#0f172a" />
        <rect x="8" y="32.5" width="24" height="1.5" rx="0.5" fill="#64748b" />
        {/* 2. Research Experience */}
        <rect x="8" y="38" width="28" height="2" rx="0.5" fill="#1e3a8a" />
        <line x1="8" y1="41.5" x2="64" y2="41.5" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x="8" y="44" width="26" height="2" rx="0.5" fill="#0f172a" />
        <rect x="8" y="47.5" width="52" height="1.5" rx="0.5" fill="#64748b" />
        {/* 3. Publications */}
        <rect x="8" y="54" width="22" height="2" rx="0.5" fill="#1e3a8a" />
        <line x1="8" y1="57.5" x2="64" y2="57.5" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x="8" y="60" width="48" height="1.5" rx="0.5" fill="#334155" />
        <rect x="8" y="63" width="40" height="1.5" rx="0.5" fill="#64748b" />
        {/* 4. Projects */}
        <rect x="8" y="69" width="18" height="2" rx="0.5" fill="#1e3a8a" />
        <line x1="8" y1="72.5" x2="64" y2="72.5" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x="8" y="75" width="30" height="2" rx="0.5" fill="#0f172a" />
        <rect x="8" y="78.5" width="50" height="1.5" rx="0.5" fill="#64748b" />
        {/* 5. Methodological Skills */}
        <rect x="8" y="84" width="26" height="2" rx="0.5" fill="#1e3a8a" />
        <line x1="8" y1="87.5" x2="64" y2="87.5" stroke="#cbd5e1" strokeWidth="0.5" />
        <rect x="8" y="90" width="52" height="1.5" rx="0.5" fill="#475569" />
      </svg>
    ),
  },
];

// Robust backwards compatibility alias map
const LEGACY_ID_MAP = {
  // Classic aliases
  'classic-professional': 'professional-classic',
  'classic': 'professional-classic',
  'professional-classic': 'professional-classic',

  // Modern Two-Column aliases
  'modern': 'modern-two-column',
  'modern-two-column': 'modern-two-column',

  // Minimalist aliases
  'minimal': 'minimalist',
  'minimalist': 'minimalist',

  // Executive aliases
  'executive': 'executive',
  'executive-bold': 'executive',

  // Creative aliases
  'creative': 'creative',
  'creative-portfolio': 'creative',
  'coral': 'creative',

  // ATS-Friendly aliases
  'minimal-ats': 'ats-friendly',
  'ats': 'ats-friendly',
  'ats-friendly': 'ats-friendly',

  // Modern Sidebar aliases
  'sidebar': 'modern-sidebar',
  'modern-sidebar': 'modern-sidebar',

  // Academic aliases
  'academic': 'academic',
  'academic-detailed': 'academic',
  'serif': 'academic',
  'elegant-serif': 'academic',

  // Legacy student/compact/tech
  'compact': 'professional-classic',
  'compact-one-page': 'professional-classic',
  'technical': 'ats-friendly',
  'technical-developer': 'ats-friendly',
};

export function getTemplateById(id) {
  const resolvedId = LEGACY_ID_MAP[id] || id;
  return (
    TEMPLATE_REGISTRY.find((t) => t.id === resolvedId) ||
    TEMPLATE_REGISTRY.find((t) => t.id === 'professional-classic') ||
    TEMPLATE_REGISTRY[0]
  );
}
