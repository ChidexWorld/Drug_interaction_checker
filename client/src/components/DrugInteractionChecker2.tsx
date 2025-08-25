import React, { useState } from "react";
import { toast } from "react-toastify";
import { AlertTriangle, Search, X, Shield, Activity } from "lucide-react";

import type { Drug } from "../types";
import { drugInteractionAPI } from "../services/api";
import LoadingSpinner from "./LoadingSpinner";

interface InteractionResult {
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
}

const DrugInteractionChecker2: React.FC = () => {
  const [drug1, setDrug1] = useState("");
  const [drug2, setDrug2] = useState("");
  const [conditions, setConditions] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<InteractionResult | null>(null);

  const handleCheckInteractions = async () => {
    if (!drug1.trim() || !drug2.trim()) {
      toast.error("Please enter both drug names");
      return;
    }

    try {
      setLoading(true);
      const conditionNames = conditions
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c.length > 0);

      const response = await drugInteractionAPI.searchAndCheckInteractions({
        drug1: drug1.trim(),
        drug2: drug2.trim(),
        condition_names: conditionNames.length > 0 ? conditionNames : undefined,
      });

      setResults(response);

      if (response.interaction.exists) {
        const severity = response.interaction.severity_score || 0;
        if (severity >= 4) {
          toast.error(`Contraindicated interaction found!`);
        } else if (severity >= 3) {
          toast.warning(`Major interaction detected!`);
        } else if (severity >= 2) {
          toast.warning(`Moderate interaction found`);
        } else {
          toast.info(`Minor interaction noted`);
        }
      } else {
        toast.success("No known interactions found");
      }
    } catch (error) {
      console.error("Error checking interactions:", error);
      toast.error("Failed to check drug interactions");
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setDrug1("");
    setDrug2("");
    setConditions("");
    setResults(null);
  };

  const getSeverityColor = (severity: number) => {
    switch (severity) {
      case 4:
        return "border-red-500 bg-red-50";
      case 3:
        return "border-orange-500 bg-orange-50";
      case 2:
        return "border-yellow-500 bg-yellow-50";
      case 1:
        return "border-blue-500 bg-blue-50";
      default:
        return "border-gray-500 bg-gray-50";
    }
  };

  const getSeverityIcon = (severity: number) => {
    switch (severity) {
      case 4:
        return <AlertTriangle className="w-6 h-6 text-red-600" />;
      case 3:
        return <AlertTriangle className="w-6 h-6 text-orange-600" />;
      case 2:
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      case 1:
        return <AlertTriangle className="w-6 h-6 text-blue-600" />;
      default:
        return <Shield className="w-6 h-6 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 px-2 sm:px-4 md:px-8 bg-gradient-to-br from-red-50 to-orange-100 min-h-screen">
      {/* Header */}
      <div className="text-center mb-2 sm:mb-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-orange-600 to-yellow-500 mb-1 sm:mb-2 drop-shadow">
          Drug Interaction Checker
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-2xl mx-auto font-medium">
          Check for harmful interactions between two medications. Enter both drug
          names to analyze potential interactions and safety concerns.
        </p>
      </div>

      {/* Input Form */}
      <div className="card p-4 sm:p-6 md:p-8 shadow-xl rounded-2xl bg-white/80 backdrop-blur-md border border-red-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-red-900">
            Check Drug Interactions
          </h2>
          {(drug1 || drug2 || conditions || results) && (
            <button
              onClick={clearForm}
              className="btn-secondary text-xs sm:text-sm px-3 py-1 rounded-lg bg-red-100 text-red-700 font-bold shadow hover:bg-red-200 transition"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Drug *
            </label>
            <input
              type="text"
              value={drug1}
              onChange={(e) => setDrug1(e.target.value)}
              placeholder="Enter first drug name (e.g., aspirin)..."
              className="w-full px-4 py-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Second Drug *
            </label>
            <input
              type="text"
              value={drug2}
              onChange={(e) => setDrug2(e.target.value)}
              placeholder="Enter second drug name (e.g., warfarin)..."
              className="w-full px-4 py-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medical Conditions (Optional)
          </label>
          <input
            type="text"
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
            placeholder="Enter conditions separated by commas (e.g., Hypertension, Diabetes)..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-600 mt-1">
            Adding conditions helps provide more accurate interaction severity
            assessments.
          </p>
        </div>

        <button
          onClick={handleCheckInteractions}
          disabled={loading || !drug1.trim() || !drug2.trim()}
          className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-orange-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <Search className="w-5 h-5" />
          )}
          Check for Interactions
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Drug Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">
                {results.drugs.drug1.generic_name}
              </h4>
              <p className="text-sm text-blue-800 mb-1">
                <strong>Class:</strong> {results.drugs.drug1.drug_class}
              </p>
              {results.drugs.drug1.brands &&
                results.drugs.drug1.brands.length > 0 && (
                  <p className="text-sm text-blue-700">
                    <strong>Brands:</strong>{" "}
                    {results.drugs.drug1.brands.slice(0, 3).join(", ")}
                    {results.drugs.drug1.brands.length > 3 &&
                      ` +${results.drugs.drug1.brands.length - 3} more`}
                  </p>
                )}
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">
                {results.drugs.drug2.generic_name}
              </h4>
              <p className="text-sm text-purple-800 mb-1">
                <strong>Class:</strong> {results.drugs.drug2.drug_class}
              </p>
              {results.drugs.drug2.brands &&
                results.drugs.drug2.brands.length > 0 && (
                  <p className="text-sm text-purple-700">
                    <strong>Brands:</strong>{" "}
                    {results.drugs.drug2.brands.slice(0, 3).join(", ")}
                    {results.drugs.drug2.brands.length > 3 &&
                      ` +${results.drugs.drug2.brands.length - 3} more`}
                  </p>
                )}
            </div>
          </div>

          {/* Interaction Results */}
          {results.interaction.exists ? (
            <div
              className={`bg-white rounded-lg border-l-4 p-6 shadow-md ${getSeverityColor(
                results.interaction.severity_score || 0
              )}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {getSeverityIcon(results.interaction.severity_score || 0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      {results.interaction.risk_level} Interaction Detected
                    </h3>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      Severity: {results.interaction.severity_score}/4
                    </span>
                  </div>

                  <div className="space-y-3">
                    {results.interaction.interaction_type && (
                      <div>
                        <h4 className="font-semibold text-gray-900">Type:</h4>
                        <p className="text-gray-700">
                          {results.interaction.interaction_type}
                        </p>
                      </div>
                    )}

                    {results.interaction.description && (
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Description:
                        </h4>
                        <p className="text-gray-700">
                          {results.interaction.description}
                        </p>
                      </div>
                    )}

                    {results.interaction.mechanism && (
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Mechanism:
                        </h4>
                        <p className="text-gray-700">
                          {results.interaction.mechanism}
                        </p>
                      </div>
                    )}

                    {results.interaction.condition_adjusted && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <h4 className="font-semibold text-yellow-800">
                          Condition-Specific Note:
                        </h4>
                        <p className="text-yellow-700">
                          {results.interaction.condition_note ||
                            "Severity adjusted based on patient conditions"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 rounded-lg border-l-4 border-green-400 p-6">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="text-lg font-bold text-green-800">
                    No Known Interactions
                  </h3>
                  <p className="text-green-700">
                    {results.interaction.message ||
                      "These medications appear to be safe to use together."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Clinical Notes */}
          {results.clinical_notes && results.clinical_notes.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Clinical Notes
              </h4>
              <div className="space-y-2">
                {results.clinical_notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-white rounded p-3 border border-blue-100"
                  >
                    <p className="text-sm text-gray-700 mb-1">
                      {note.clinical_note}
                    </p>
                    {note.recommendation && (
                      <p className="text-xs text-blue-600 font-medium">
                        <strong>Recommendation:</strong> {note.recommendation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alternative Drugs */}
          {results.alternative_drugs && results.alternative_drugs.length > 0 && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-semibold text-green-900 mb-3">
                Alternative Drug Suggestions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.alternative_drugs.map((alt, index) => (
                  <div
                    key={index}
                    className="bg-white rounded p-3 border border-green-100"
                  >
                    <p className="font-medium text-gray-900">
                      Instead of {alt.original_drug_name}:
                    </p>
                    <p className="text-green-700 font-semibold">
                      {alt.alternative_name}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">{alt.reason}</p>
                    {alt.safety_note && (
                      <p className="text-xs text-green-600 mt-1">
                        {alt.safety_note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {results.recommendations && results.recommendations.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">
                Recommendations
              </h4>
              <div className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                    <p className="text-sm text-gray-700">{rec.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Help Text */}
      {!results && !loading && (
        <div className="text-center py-10 sm:py-12">
          <Shield className="w-10 sm:w-12 h-10 sm:h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-red-900 mb-2">
            Check Drug Interactions
          </h3>
          <p className="text-gray-600">
            Enter two drug names above to check for potential interactions and
            safety concerns.
          </p>
        </div>
      )}
    </div>
  );
};

export default DrugInteractionChecker2;