export type Language = 'hi' | 'mr' | 'ta' | 'bn' | 'te' | 'en'

export type RiskLevel = 'safe' | 'caution' | 'danger'

export type CaseType = 
  | 'wage_dispute'
  | 'property'
  | 'consumer'
  | 'criminal'
  | 'family'
  | 'cyber'
  | 'rti'
  | 'medical'
  | 'environmental'

export type DocumentType = 
  | 'unpaid_salary_notice'
  | 'wrongful_termination_notice'
  | 'gratuity_demand'
  | 'pf_complaint'
  | 'maternity_demand'
  | 'labour_court_complaint'
  | 'posh_complaint'
  | 'overtime_demand'
  | 'eviction_reply'
  | 'deposit_refund_notice'
  | 'rera_complaint'
  | 'rent_hike_objection'
  | 'tenant_rights_petition'
  | 'consumer_forum_complaint'
  | 'ecommerce_refund_demand'
  | 'banking_ombudsman'
  | 'insurance_rejection_reply'
  | 'loan_harassment_complaint'
  | 'upi_fraud_complaint'
  | 'cheque_bounce_notice'
  | 'fir_draft_theft'
  | 'fir_draft_cyber'
  | 'police_harassment_complaint'
  | 'magistrate_complaint'
  | 'domestic_violence_notice'
  | 'maintenance_petition'
  | 'child_custody_application'
  | 'dowry_harassment_complaint'
  | 'rti_application'
  | 'rti_first_appeal'
  | 'government_scheme_complaint'
  | 'writ_petition_226'
  | 'medical_negligence_complaint'
  | 'defamation_notice'
  | 'dpdp_data_deletion'
  | 'ngopollution_complaint'
  | 'land_acquisition_objection'
  | 'mgnrega_wage_demand'

export interface Clause {
  id: string
  text: string
  risk: RiskLevel
  law: string
  section: string
  explanation: string
  counterClause?: string
}

export interface Case {
  id: string
  type: CaseType
  title: string
  status: 'active' | 'resolved' | 'pending'
  createdAt: Date
  limitationDate?: Date
  facts: string
  actsRelevant: string[]
  nextStep?: string
}

export interface Amendment {
  id: string
  actName: string
  section: string
  oldText: string
  newText: string
  diffSummary: string
  gazetteDate: Date
  relevantCases?: string[]
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  language: Language
  retrievedSections?: string[]
  confidence?: number
  winProbability?: number
}

export interface NyayaScoreComponent {
  name: string
  score: number
  maxScore: number
  issues: string[]
  color: string
}

export interface DLSAOffice {
  state: string
  district: string
  name: string
  address: string
  phone: string
  lat: number
  lng: number
  distanceKm?: number
}

export interface LimitationPeriod {
  caseType: CaseType
  days: number
  description: string
}
