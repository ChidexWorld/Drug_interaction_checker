// Drug-related types
export interface Drug {
  id: number;
  generic_name: string;
  drug_class: string;
  description: string;
  brands?: string[];
  manufacturers?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface DrugBrand {
  id: number;
  brand_name: string;
  manufacturer: string;
  country: string;
}

// Interaction-related types
export interface Interaction {
  id: number;
  drug1_id: number;
  drug2_id: number;
  drug1_name: string;
  drug2_name: string;
  interaction_type: "Minor" | "Moderate" | "Major" | "Contraindicated";
  severity_score: 1 | 2 | 3 | 4;
  description: string;
  mechanism?: string;
  condition_note?: string;
  condition_adjusted?: boolean;
  clinical_notes?: ClinicalNote[];
  alternatives?: AlternativeDrug[];
}

export interface ClinicalNote {
  note_type: "general" | "monitoring" | "contraindication";
  clinical_note: string;
  recommendation?: string;
}

export interface AlternativeDrug {
  original_drug_id: number;
  alternative_name: string;
  alternative_class: string;
  reason: string;
  safety_note?: string;
}

// Condition-related types
export interface Condition {
  id: number;
  name: string;
  description: string;
  severity_level: 1 | 2 | 3;
  symptoms?: string[] | Symptom[];
  created_at?: string;
}

export interface Symptom {
  id: number;
  name: string;
  description: string;
  severity: number;
  relevance_score?: number;
  related_conditions?: string[] | Condition[];
  created_at?: string;
}

// API Response types
export interface DrugSearchResponse {
  query: string;
  results: Drug[];
  count: number;
}

export interface InteractionCheckResponse {
  drugs: Drug[];
  interactions: Interaction[];
  summary: {
    total_interactions: number;
    max_severity: number;
    risk_level: string;
    risk_color: string;
    condition_considered: boolean;
  };
}

export interface ConditionsResponse {
  conditions: Condition[];
}

export interface SymptomsResponse {
  symptoms: Symptom[];
}

export interface SuggestConditionsResponse {
  symptom_ids: number[];
  suggested_conditions: (Condition & {
    confidence_score: number;
    matching_symptoms: number;
    matched_symptom_names: string[];
  })[];
  count: number;
}

// Form and UI types
export interface DrugSelection {
  drug: Drug;
  selected: boolean;
}

export interface InteractionCheckForm {
  selectedDrugs: Drug[];
  selectedCondition?: Condition;
}

// Utility types
export type SeverityLevel = 1 | 2 | 3 | 4;
export type InteractionType =
  | "Minor"
  | "Moderate"
  | "Major"
  | "Contraindicated";

export interface ApiError {
  error: string;
  message: string;
  details?: string;
}

// Component prop types
export interface DrugSelectProps {
  onDrugSelect: (drug: Drug) => void;
  selectedDrugs: Drug[];
  placeholder?: string;
}

export interface InteractionResultsProps {
  results: InteractionCheckResponse | null;
  loading: boolean;
}

export interface SeverityBadgeProps {
  severity: SeverityLevel;
  type: InteractionType;
  className?: string;
}
