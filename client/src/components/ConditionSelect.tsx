import React from "react";
import { ChevronDown, X } from "lucide-react";
import type { Condition } from "../types";
import LoadingSpinner from "./LoadingSpinner";

interface ConditionSelectProps {
  conditions: Condition[];
  selectedCondition: Condition | null;
  onConditionSelect: (condition: Condition | null) => void;
  loading?: boolean;
}

const ConditionSelect: React.FC<ConditionSelectProps> = ({
  conditions,
  selectedCondition,
  onConditionSelect,
  loading = false,
}) => {
  if (loading) {
    return (
      <div
        className="flex items-center justify-center py-4"
        role="status"
        aria-live="polite"
      >
        <LoadingSpinner size="sm" />
        <span className="ml-2 text-sm text-gray-600">
          Loading conditions...
        </span>
      </div>
    );
  }

  if (!loading && (!conditions || conditions.length === 0)) {
    return (
      <div className="flex items-center justify-center py-4 text-gray-500 text-sm">
        No conditions available.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Selected Condition Display */}
      {selectedCondition && (
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div>
            <div className="font-medium text-blue-900">
              {selectedCondition.name}
            </div>
            <div className="text-sm text-blue-700">
              {selectedCondition.description}
            </div>
            {selectedCondition.symptoms &&
              selectedCondition.symptoms.length > 0 && (
                <div className="text-xs text-blue-600 mt-1">
                  Related symptoms:{" "}
                  {Array.isArray(selectedCondition.symptoms)
                    ? selectedCondition.symptoms
                        .slice(0, 3)
                        .map((s) => (typeof s === "string" ? s : s.name))
                        .join(", ")
                    : String(selectedCondition.symptoms)
                        .split(",")
                        .slice(0, 3)
                        .join(", ")}
                  {(Array.isArray(selectedCondition.symptoms)
                    ? selectedCondition.symptoms.length
                    : String(selectedCondition.symptoms).split(",").length) >
                    3 && " +more"}
                </div>
              )}
          </div>
          <button
            onClick={() => onConditionSelect(null)}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="Remove condition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Condition Selection */}
      {!selectedCondition && (
        <div className="relative">
          <select
            onChange={(e) => {
              const conditionId = parseInt(e.target.value);
              const condition = conditions.find((c) => c.id === conditionId);
              onConditionSelect(condition || null);
            }}
            value={""}
            className="input appearance-none pr-10 cursor-pointer"
            aria-label="Select a medical condition"
          >
            <option value="">Select a medical condition (optional)</option>
            {conditions.map((condition) => (
              <option key={condition.id} value={condition.id}>
                {condition.name} - {condition.description}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      )}

      {/* Common Conditions Quick Select */}
      {!selectedCondition && conditions.length > 0 && (
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">
            Common Conditions:
          </div>
          <div className="flex flex-wrap gap-2">
            {conditions
              .filter((condition) =>
                [
                  "Hypertension",
                  "Diabetes",
                  "Heart Failure",
                  "Kidney Disease",
                  "Pregnancy",
                  "Elderly (65+)",
                ].includes(condition.name)
              )
              .map((condition) => (
                <button
                  key={condition.id}
                  onClick={() => onConditionSelect(condition)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {condition.name}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Severity Level Indicator */}
      {selectedCondition && (
        <div className="text-xs text-gray-600">
          <span className="font-medium">Severity Level:</span>{" "}
          <span
            className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${
              selectedCondition.severity_level === 3
                ? "bg-red-100 text-red-800"
                : selectedCondition.severity_level === 2
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            }
          `}
          >
            {selectedCondition.severity_level === 3
              ? "High"
              : selectedCondition.severity_level === 2
              ? "Moderate"
              : "Low"}
          </span>
        </div>
      )}
    </div>
  );
};

export default ConditionSelect;
