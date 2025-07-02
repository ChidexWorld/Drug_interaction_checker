import axios from "axios";
import type {
  Drug,
  DrugSearchResponse,
  InteractionCheckResponse,
  ConditionsResponse,
  SymptomsResponse,
  SuggestConditionsResponse,
  Condition,
  Symptom,
} from "../types/index";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

// Drug API endpoints
export const drugAPI = {
  // Search drugs by name (generic or brand)
  searchDrugs: async (
    query: string,
    limit: number = 20
  ): Promise<DrugSearchResponse> => {
    const response = await api.get("/drugs/search", {
      params: { query, limit },
    });
    return response.data;
  },

  // Get all drugs with pagination
  getAllDrugs: async (page: number = 1, limit: number = 20) => {
    const response = await api.get("/drugs", {
      params: { page, limit },
    });
    return response.data;
  },

  // Get specific drug details
  getDrugById: async (id: number): Promise<Drug> => {
    const response = await api.get(`/drugs/${id}`);
    return response.data;
  },

  // Get drug interactions
  getDrugInteractions: async (id: number) => {
    const response = await api.get(`/drugs/${id}/interactions`);
    return response.data;
  },
};

// Interaction API endpoints
export const interactionAPI = {
  // Check interactions between multiple drugs
  checkInteractions: async (
    drugIds: number[],
    conditionId?: number
  ): Promise<InteractionCheckResponse> => {
    const response = await api.post("/interactions/check", {
      drug_ids: drugIds,
      condition_id: conditionId,
    });
    return response.data;
  },
};

// Condition API endpoints
export const conditionAPI = {
  // Get all conditions
  getAllConditions: async (): Promise<ConditionsResponse> => {
    const response = await api.get("/conditions");
    return response.data;
  },

  // Get specific condition details
  getConditionById: async (id: number): Promise<Condition> => {
    const response = await api.get(`/conditions/${id}`);
    return response.data;
  },

  // Get condition-specific interactions
  getConditionInteractions: async (id: number) => {
    const response = await api.get(`/conditions/${id}/interactions`);
    return response.data;
  },
};

// Symptom API endpoints
export const symptomAPI = {
  // Get all symptoms
  getAllSymptoms: async (): Promise<SymptomsResponse> => {
    const response = await api.get("/symptoms");
    return response.data;
  },

  // Search symptoms
  searchSymptoms: async (query: string, limit: number = 20) => {
    const response = await api.get("/symptoms/search", {
      params: { query, limit },
    });
    return response.data;
  },

  // Get specific symptom details
  getSymptomById: async (id: number): Promise<Symptom> => {
    const response = await api.get(`/symptoms/${id}`);
    return response.data;
  },

  // Suggest conditions based on symptoms
  suggestConditions: async (
    symptomIds: number[]
  ): Promise<SuggestConditionsResponse> => {
    const response = await api.post("/symptoms/suggest-conditions", {
      symptom_ids: symptomIds,
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
