import axios from "axios";
import type {
  Drug,
  DrugSearchResponse,
  InteractionCheckResponse,
} from "../types/index";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Response Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Drug checker API - all available endpoints
export const drugAPI = {
  // Search drugs by name
  searchDrugs: async (
    query: string,
    limit: number = 20
  ): Promise<DrugSearchResponse> => {
    const response = await api.get("/drug-checker/search-drugs", {
      params: { query, limit },
    });
    return response.data;
  },

  // Get drug details by name
  getDrugDetailsByName: async (name: string): Promise<{
    search_term: string;
    drug: Drug;
    match_quality: string;
  }> => {
    const response = await api.get("/drug-checker/drug-details", {
      params: { name },
    });
    return response.data;
  },
};

// Drug interaction API - comprehensive interaction checking
export const drugInteractionAPI = {
  // Search and check interactions between 2 drugs
  searchAndCheckInteractions: async (data: {
    drug1: string;
    drug2: string;
    condition_names?: string[];
  }): Promise<{
    search_terms: { drug1: string; drug2: string };
    drugs: {
      drug1: Drug;
      drug2: Drug;
    };
    interaction: {
      exists: boolean;
      interaction_type?: string;
      severity_score?: number;
      description?: string;
      mechanism?: string;
      risk_level: string;
      risk_color: string;
      condition_adjusted?: boolean;
      condition_note?: string;
      message?: string;
    };
    clinical_notes?: Array<{
      id: number;
      clinical_note: string;
      note_type: string;
      recommendation: string;
    }>;
    alternative_drugs?: Array<{
      original_drug_id: number;
      alternative_drug_id: number;
      reason: string;
      safety_note: string;
      original_drug_name: string;
      alternative_name: string;
      alternative_class: string;
    }>;
    recommendations: Array<{
      type: string;
      message: string;
      priority: string;
    }>;
  }> => {
    const response = await api.post("/drug-checker/search-and-check", data);
    return response.data;
  },
};

// Conditions API
export const conditionsAPI = {
  // Get all conditions with optional search
  getAllConditions: async (search?: string): Promise<{
    search_term: string | null;
    conditions: Array<{
      id: number;
      name: string;
      description: string;
      symptoms: Array<{
        id: number;
        name: string;
        description: string;
        severity: number;
      }>;
    }>;
    total: number;
  }> => {
    const response = await api.get("/drug-checker/conditions", {
      params: search ? { search } : {},
    });
    return response.data;
  },

  // Get condition details by name
  getConditionDetailsByName: async (name: string): Promise<{
    search_term: string;
    condition: {
      id: number;
      name: string;
      description: string;
      symptoms: Array<{
        id: number;
        name: string;
        description: string;
        severity: number;
      }>;
      symptom_count: number;
      related_conditions: Array<{
        id: number;
        name: string;
        shared_symptoms: number;
      }>;
    };
  }> => {
    const response = await api.get("/drug-checker/condition-details", {
      params: { name },
    });
    return response.data;
  },
};

// Health check
export const healthAPI = {
  checkHealth: async () => {
    const response = await api.get("/health");
    return response.data;
  },
};

export default api;
