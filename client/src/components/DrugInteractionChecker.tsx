import React, { useState } from "react";
import { toast } from "react-toastify";
import { AlertTriangle, Search, X } from "lucide-react";

import type { Drug } from "../types";
import { drugAPI } from "../services/api";
import DrugSelect from "./DrugSelect";
import DrugDetails from "./DrugDetails";
import LoadingSpinner from "./LoadingSpinner";

const DrugInteractionChecker: React.FC = () => {
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [drugDetails, setDrugDetails] = useState<{
    search_term: string;
    drug: Drug;
    match_quality: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDrugSelect = async (drug: Drug) => {
    setSelectedDrug(drug);
    
    // Get detailed information for the selected drug
    try {
      setLoading(true);
      const details = await drugAPI.getDrugDetailsByName(drug.generic_name);
      setDrugDetails(details);
      
      toast.success(`Loaded details for ${drug.generic_name}`);
    } catch (error) {
      console.error("Error loading drug details:", error);
      toast.error("Failed to load drug details");
      setDrugDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedDrug(null);
    setDrugDetails(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 px-2 sm:px-4 md:px-8 bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen">
      {/* Header */}
      <div className="text-center mb-2 sm:mb-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 mb-1 sm:mb-2 drop-shadow">
          Drug Information Checker
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-2xl mx-auto font-medium">
          Search for any medication to get detailed information including generic name, 
          drug class, description, brand names, and manufacturers.
        </p>
      </div>

      {/* Drug Selection */}
      <div className="card p-4 sm:p-6 md:p-8 shadow-xl rounded-2xl bg-white/80 backdrop-blur-md border border-blue-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-blue-900">
            Search for Drug Information
          </h2>
          {selectedDrug && (
            <button
              onClick={handleClearSelection}
              className="btn-secondary text-xs sm:text-sm px-3 py-1 rounded-lg bg-blue-100 text-blue-700 font-bold shadow hover:bg-blue-200 transition"
            >
              Clear Selection
            </button>
          )}
        </div>

        <DrugSelect
          onDrugSelect={handleDrugSelect}
          selectedDrugs={selectedDrug ? [selectedDrug] : []}
          placeholder="Search for drugs by generic or brand name..."
        />

        {/* Selected Drug */}
        {selectedDrug && (
          <div className="mt-4">
            <h3 className="text-xs sm:text-sm font-medium text-blue-700 mb-2">
              Selected Drug
            </h3>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-900 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow">
                <span className="font-medium">{selectedDrug.generic_name}</span>
                <span className="text-purple-500">({selectedDrug.drug_class})</span>
                <button
                  onClick={handleClearSelection}
                  className="text-pink-500 hover:text-pink-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 mt-2">Loading drug details...</p>
        </div>
      )}

      {/* Drug Details */}
      {drugDetails && !loading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-blue-900">
              Drug Information
            </h2>
            {drugDetails.match_quality === "partial" && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                Partial Match
              </span>
            )}
          </div>
          <DrugDetails drug={drugDetails.drug} />
        </div>
      )}

      {/* Help Text */}
      {!selectedDrug && !loading && (
        <div className="text-center py-10 sm:py-12">
          <Search className="w-10 sm:w-12 h-10 sm:h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-blue-900 mb-2">
            Search for Drug Information
          </h3>
          <p className="text-gray-600">
            Enter a drug name in the search box above to get detailed information 
            about the medication.
          </p>
        </div>
      )}
    </div>
  );
};

export default DrugInteractionChecker;