import React from "react";
import {
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";
import type { InteractionResultsProps, Interaction } from "../types";
import LoadingSpinner from "./LoadingSpinner";
import SeverityBadge from "./SeverityBadge";

const InteractionResults: React.FC<InteractionResultsProps> = ({
  results,
  loading,
}) => {
  if (loading) {
    return (
      <div className="card p-8">
        <div className="flex items-center justify-center">
          <LoadingSpinner size="md" />
          <span className="ml-3 text-gray-600">Checking interactions...</span>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  const { interactions, summary } = results;

  const getSummaryIcon = () => {
    switch (summary.max_severity) {
      case 4:
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 3:
        return <AlertTriangle className="w-6 h-6 text-orange-600" />;
      case 2:
        return <Info className="w-6 h-6 text-yellow-600" />;
      case 1:
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      default:
        return <CheckCircle className="w-6 h-6 text-green-600" />;
    }
  };

  const getSummaryBgColor = () => {
    switch (summary.max_severity) {
      case 4:
        return "bg-red-50 border-red-200";
      case 3:
        return "bg-orange-50 border-orange-200";
      case 2:
        return "bg-yellow-50 border-yellow-200";
      case 1:
        return "bg-green-50 border-green-200";
      default:
        return "bg-green-50 border-green-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className={`card p-6 border-2 ${getSummaryBgColor()}`}>
        <div className="flex items-start space-x-4">
          {getSummaryIcon()}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Interaction Check Results
            </h3>
            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-medium">Risk Level:</span>{" "}
                <span
                  className="font-semibold"
                  style={{ color: summary.risk_color }}
                >
                  {summary.risk_level}
                </span>
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Total Interactions Found:</span>{" "}
                {summary.total_interactions}
              </p>
              {summary.condition_considered && (
                <p className="text-sm text-blue-600">
                  ✓ Results adjusted for selected medical condition
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* No Interactions */}
      {interactions.length === 0 && (
        <div className="card p-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Known Interactions
          </h3>
          <p className="text-gray-600">
            The selected drugs do not have any known interactions in our
            database. However, always consult with a healthcare professional
            before taking multiple medications.
          </p>
        </div>
      )}

      {/* Interactions List */}
      {interactions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Detailed Interactions ({interactions.length})
          </h3>

          {interactions
            .sort((a, b) => b.severity_score - a.severity_score)
            .map((interaction, index) => (
              <InteractionCard key={index} interaction={interaction} />
            ))}
        </div>
      )}
    </div>
  );
};

const InteractionCard: React.FC<{ interaction: Interaction }> = ({
  interaction,
}) => {
  return (
    <div className="card p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-lg font-medium text-gray-900">
              {interaction.drug1_name}
              <ArrowRight className="inline w-4 h-4 mx-2 text-gray-400" />
              {interaction.drug2_name}
            </div>
            <SeverityBadge
              severity={interaction.severity_score}
              type={interaction.interaction_type}
            />
          </div>
          {interaction.condition_adjusted && (
            <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Condition Adjusted
            </div>
          )}
        </div>

        {/* Description */}
        <div className="text-gray-700">{interaction.description}</div>

        {/* Mechanism */}
        {interaction.mechanism && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-gray-900 mb-1">
              Mechanism:
            </div>
            <div className="text-sm text-gray-700">{interaction.mechanism}</div>
          </div>
        )}

        {/* Condition Note */}
        {interaction.condition_note && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-blue-900 mb-1">
              Condition-Specific Note:
            </div>
            <div className="text-sm text-blue-800">
              {interaction.condition_note}
            </div>
          </div>
        )}

        {/* Clinical Notes */}
        {interaction.clinical_notes &&
          interaction.clinical_notes.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-900">
                Clinical Notes:
              </div>
              {interaction.clinical_notes.map((note, index) => (
                <div key={index} className="bg-yellow-50 p-3 rounded-lg">
                  <div className="text-sm">
                    <span className="font-medium text-yellow-900 capitalize">
                      {note.note_type}:
                    </span>{" "}
                    <span className="text-yellow-800">
                      {note.clinical_note}
                    </span>
                  </div>
                  {note.recommendation && (
                    <div className="text-sm text-yellow-700 mt-1">
                      <span className="font-medium">Recommendation:</span>{" "}
                      {note.recommendation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        {/* Alternatives */}
        {interaction.alternatives && interaction.alternatives.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-900">
              Safer Alternatives:
            </div>
            <div className="space-y-2">
              {interaction.alternatives.map((alt, index) => (
                <div key={index} className="bg-green-50 p-3 rounded-lg">
                  <div className="text-sm">
                    <span className="font-medium text-green-900">
                      {alt.alternative_name}
                    </span>{" "}
                    <span className="text-green-700">
                      ({alt.alternative_class})
                    </span>
                  </div>
                  <div className="text-sm text-green-700 mt-1">
                    <span className="font-medium">Reason:</span> {alt.reason}
                  </div>
                  {alt.safety_note && (
                    <div className="text-sm text-green-600 mt-1">
                      <span className="font-medium">Safety Note:</span>{" "}
                      {alt.safety_note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractionResults;
