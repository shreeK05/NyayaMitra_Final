import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Language, RiskLevel } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const LANGUAGES: Record<Language, { name: string; nativeName: string; flag: string }> = {
  hi: { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  mr: { name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  ta: { name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  bn: { name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  te: { name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  en: { name: 'English', nativeName: 'English', flag: '🇬🇧' },
}

export const RISK_CONFIG: Record<RiskLevel, { label: string; color: string; bg: string; border: string; icon: string }> = {
  safe: { label: 'Safe', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', icon: '✓' },
  caution: { label: 'Caution', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', icon: '⚠' },
  danger: { label: 'Illegal/Void', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', icon: '✗' },
}

export const LIMITATION_PERIODS: Record<string, number> = {
  consumer: 730,       // 2 years
  wage_dispute: 1095,  // 3 years
  property: 4380,      // 12 years
  cheque_bounce: 30,   // 1 month notice, 1 month to file
  criminal: 180,       // 6 months
  family: 1095,
  cyber: 365,
  medical: 730,
  rti: 30,
  environmental: 365,
}

export const DOCUMENT_CATEGORIES = [
  {
    id: 'employment',
    name: 'Employment & Wages',
    icon: '💼',
    count: 8,
    color: '#f59e0b',
  },
  {
    id: 'property',
    name: 'Property & Tenancy',
    icon: '🏠',
    count: 7,
    color: '#06b6d4',
  },
  {
    id: 'consumer',
    name: 'Consumer & Financial',
    icon: '⚖️',
    count: 7,
    color: '#7c3aed',
  },
  {
    id: 'criminal',
    name: 'Criminal & Police',
    icon: '🚔',
    count: 6,
    color: '#ef4444',
  },
  {
    id: 'family',
    name: 'Family & Personal',
    icon: '👨‍👩‍👧',
    count: 5,
    color: '#10b981',
  },
  {
    id: 'cyber',
    name: 'Cyber & Digital Rights',
    icon: '🛡️',
    count: 5,
    color: '#3b82f6',
  },
  {
    id: 'rti',
    name: 'Government & RTI',
    icon: '🏛️',
    count: 5,
    color: '#ff9933',
  },
  {
    id: 'medical',
    name: 'Medical & Education',
    icon: '🏥',
    count: 4,
    color: '#ec4899',
  },
  {
    id: 'environmental',
    name: 'Environmental & Land',
    icon: '🌿',
    count: 5,
    color: '#22c55e',
  },
]

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function daysUntil(date: Date): number {
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str
  return str.slice(0, maxLen) + '...'
}

export const EMERGENCY_CONTACTS = [
  { name: 'Women Helpline', number: '181', icon: '👩' },
  { name: 'Police', number: '100', icon: '🚔' },
  { name: 'iCall (Mental Health)', number: '9152987821', icon: '💚' },
  { name: 'National Legal Services', number: '15100', icon: '⚖️' },
]

export const SAMPLE_AMENDMENTS = [
  {
    id: '1',
    actName: 'Bharatiya Nyaya Sanhita 2023',
    section: 'Section 85',
    oldText: 'Whoever commits cruelty against wife shall be punished with imprisonment of either description for a term which may extend to three years.',
    newText: 'Whoever commits cruelty against wife shall be punished with imprisonment of either description for a term which may extend to five years.',
    diffSummary: 'Imprisonment for domestic cruelty increased from 3 to 5 years. This strengthens protection for women facing domestic violence.',
    gazetteDate: new Date('2026-03-01'),
    relevantCases: ['DV-2024-001', 'FAM-2024-089'],
  },
  {
    id: '2',
    actName: 'Payment of Wages Act 1936',
    section: 'Section 15',
    oldText: 'The authority empowered under this section may direct the employer to pay the unpaid wages along with compensation not exceeding ten times the amount.',
    newText: 'The authority empowered under this section may direct the employer to pay the unpaid wages along with compensation not exceeding twenty times the amount.',
    diffSummary: 'Compensation for wage theft doubled from 10x to 20x the unpaid amount. This massively increases employer liability for wage disputes.',
    gazetteDate: new Date('2026-02-15'),
    relevantCases: [],
  },
]

export const SAMPLE_CASES = [
  {
    id: 'case-1',
    type: 'wage_dispute' as const,
    title: 'Unpaid Salary - Sharma Textiles',
    status: 'active' as const,
    createdAt: new Date('2024-01-15'),
    limitationDate: new Date('2027-01-15'),
    facts: 'Employer has not paid salary for 3 months. Amount: Rs. 72,000',
    actsRelevant: ['Payment of Wages Act 1936', 'Industrial Disputes Act 1947'],
    nextStep: 'Send legal notice to employer with 15-day deadline',
  },
  {
    id: 'case-2',
    type: 'property' as const,
    title: 'Illegal Eviction - Landlord Mehta',
    status: 'pending' as const,
    createdAt: new Date('2024-02-20'),
    limitationDate: new Date('2025-02-20'),
    facts: 'Landlord is attempting eviction without court order during lock-in period',
    actsRelevant: ['Maharashtra Rent Control Act 1999', 'Transfer of Property Act 1882'],
    nextStep: 'File petition with Rent Control Authority',
  },
]
