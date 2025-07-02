import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { AlertTriangle, Search, X, Plus } from "lucide-react";

import type { Drug, Condition, InteractionCheckResponse } from "../types";
import { interactionAPI, conditionAPI } from "../services/api";
import DrugSelect from "./DrugSelect";
import ConditionSelect from "./ConditionSelect";
import InteractionResults from "./InteractionResults";
import LoadingSpinner from "./LoadingSpinner";

const DrugInteractionChecker: React.FC = () => {
  const [selectedDrugs, setSelectedDrugs] = useState<Drug[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(
    null
  );
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [interactionResults, setInteractionResults] =
    useState<InteractionCheckResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [conditionsLoading, setConditionsLoading] = useState(true);

  // Load conditions on component mount
  useEffect(() => {
    loadConditions();
  }, []);

  const loadConditions = async () => {
    try {
      setConditionsLoading(true);
      const response = await conditionAPI.getAllConditions();
      setConditions(response.conditions);
    } catch (error) {
      console.error("Error loading conditions:", error);
      toast.error("Failed to load conditions");
    } finally {
      setConditionsLoading(false);
    }
  };

  const handleDrugSelect = (drug: Drug) => {
    if (selectedDrugs.find((d) => d.id === drug.id)) {
      toast.warning("Drug already selected");
      return;
    }

    if (selectedDrugs.length >= 10) {
      toast.warning("Maximum 10 drugs can be selected");
      return;
    }

    setSelectedDrugs((prev) => [...prev, drug]);

    // Auto-check interactions if we have 2 or more drugs
    if (selectedDrugs.length >= 1) {
      setTimeout(() => checkInteractions([...selectedDrugs, drug]), 500);
    }
  };

  const handleDrugRemove = (drugId: number) => {
    const newSelectedDrugs = selectedDrugs.filter((drug) => drug.id !== drugId);
    setSelectedDrugs(newSelectedDrugs);

    // Re-check interactions if we still have 2+ drugs
    if (newSelectedDrugs.length >= 2) {
      setTimeout(() => checkInteractions(newSelectedDrugs), 500);
    } else {
      setInteractionResults(null);
    }
  };

  const handleConditionSelect = (condition: Condition | null) => {
    setSelectedCondition(condition);

    // Re-check interactions with new condition if we have drugs selected
    if (selectedDrugs.length >= 2) {
      setTimeout(() => checkInteractions(selectedDrugs, condition), 500);
    }
  };

  const checkInteractions = async (
    drugs: Drug[] = selectedDrugs,
    condition: Condition | null = selectedCondition
  ) => {
    if (drugs.length < 2) {
      setInteractionResults(null);
      return;
    }

    try {
      setLoading(true);
      const drugIds = drugs.map((drug) => drug.id);
      const response = await interactionAPI.checkInteractions(
        drugIds,
        condition?.id
      );
      setInteractionResults(response);

      // Show toast based on results
      if (response.summary.total_interactions === 0) {
        toast.success("No known interactions found");
      } else if (response.summary.max_severity >= 3) {
        toast.error(`${response.summary.risk_level} interactions found!`);
      } else if (response.summary.max_severity >= 2) {
        toast.warning(`${response.summary.risk_level} interactions found`);
      } else {
        toast.info(`${response.summary.risk_level} interactions found`);
      }
    } catch (error) {
      console.error("Error checking interactions:", error);
      toast.error("Failed to check interactions");
      setInteractionResults(null);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setSelectedDrugs([]);
    setSelectedCondition(null);
    setInteractionResults(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 px-2 sm:px-4 md:px-8 bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen">
      {/* Header */}
      <div className="text-center mb-2 sm:mb-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 mb-1 sm:mb-2 drop-shadow">
          Drug Interaction Checker
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-2xl mx-auto font-medium">
          Check for harmful interactions between medications. Select drugs and
          optionally specify a medical condition for condition-aware severity
          adjustments.
        </p>
      </div>

      {/* Drug Selection */}
      <div className="card p-4 sm:p-6 md:p-8 shadow-xl rounded-2xl bg-white/80 backdrop-blur-md border border-blue-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-blue-900">
            Select Drugs to Check
          </h2>
          {selectedDrugs.length > 0 && (
            <button
              onClick={clearAll}
              className="btn-secondary text-xs sm:text-sm px-3 py-1 rounded-lg bg-blue-100 text-blue-700 font-bold shadow hover:bg-blue-200 transition"
            >
              Clear All
            </button>
          )}
        </div>

        <DrugSelect
          onDrugSelect={handleDrugSelect}
          selectedDrugs={selectedDrugs}
          placeholder="Search for drugs by generic or brand name..."
        />

        {/* Selected Drugs */}
        {selectedDrugs.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xs sm:text-sm font-medium text-blue-700 mb-2">
              Selected Drugs ({selectedDrugs.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedDrugs.map((drug) => (
                <div
                  key={drug.id}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-900 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow hover:scale-105 transition"
                >
                  <span className="font-medium">{drug.generic_name}</span>
                  <span className="text-purple-500">({drug.drug_class})</span>
                  <button
                    onClick={() => handleDrugRemove(drug.id)}
                    className="text-pink-500 hover:text-pink-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Condition Selection */}
      <div className="card p-4 sm:p-6 md:p-8 shadow-xl rounded-2xl bg-white/80 backdrop-blur-md border border-purple-100">
        <h2 className="text-lg sm:text-xl font-bold text-purple-800 mb-2 sm:mb-4">
          Patient Condition (Optional)
        </h2>
        <p className="text-xs sm:text-sm text-purple-600 mb-4">
          Select a medical condition to get condition-aware interaction severity
          adjustments.
        </p>

        <ConditionSelect
          conditions={conditions}
          selectedCondition={selectedCondition}
          onConditionSelect={handleConditionSelect}
          loading={conditionsLoading}
        />
      </div>

      {/* Manual Check Button */}
      {selectedDrugs.length >= 2 && (
        <div className="text-center">
          <button
            onClick={() => checkInteractions()}
            disabled={loading}
            className="btn-primary inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold shadow hover:scale-105 transition disabled:opacity-60"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Check Interactions
          </button>
        </div>
      )}

      {/* Results */}
      <InteractionResults results={interactionResults} loading={loading} />

      {/* Help Text */}
      {selectedDrugs.length === 0 && (
        <div className="text-center py-10 sm:py-12">
          <AlertTriangle className="w-10 sm:w-12 h-10 sm:h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-blue-900 mb-2">
            Start by selecting drugs
          </h3>
          <p className="text-gray-600">
            Search and select at least 2 drugs to check for interactions.
          </p>
        </div>
      )}

      {selectedDrugs.length === 1 && (
        <div className="text-center py-6 sm:py-8">
          <Plus className="w-7 sm:w-8 h-7 sm:h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">
            Select one more drug to check for interactions.
          </p>
        </div>
      )}
    </div>
  );
};

export default DrugInteractionChecker;
