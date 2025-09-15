import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface CriticalInteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  severity: number;
  drug1Name: string;
  drug2Name: string;
  description?: string;
}

const CriticalInteractionModal: React.FC<CriticalInteractionModalProps> = ({
  isOpen,
  onClose,
  severity,
  drug1Name,
  drug2Name,
  description,
}) => {
  if (!isOpen) return null;

  const isContraindicated = severity >= 4;

  const getModalContent = () => {
    if (isContraindicated) {
      return {
        title: "⚠️ CRITICAL WARNING - CONTRAINDICATED",
        subtitle: "This drug combination is DANGEROUS and should NOT be used together!",
        bgColor: "bg-red-600",
        borderColor: "border-red-500",
        textColor: "text-red-800",
        bgLight: "bg-red-50",
        icon: "🚫",
        message: `${drug1Name} and ${drug2Name} should never be taken together. This combination can cause serious harm or life-threatening complications.`,
        buttonText: "I Understand - Do Not Use Together",
        buttonBg: "bg-red-600 hover:bg-red-700"
      };
    } else {
      return {
        title: "🚨 MAJOR INTERACTION WARNING",
        subtitle: "This drug combination requires immediate medical attention!",
        bgColor: "bg-orange-600",
        borderColor: "border-orange-500",
        textColor: "text-orange-800",
        bgLight: "bg-orange-50",
        icon: "⚠️",
        message: `${drug1Name} and ${drug2Name} have a major interaction. You must consult your healthcare provider immediately before using these medications together.`,
        buttonText: "I Understand - Will Consult Doctor",
        buttonBg: "bg-orange-600 hover:bg-orange-700"
      };
    }
  };

  const content = getModalContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 border-4 ${content.borderColor} animate-pulse`}>
        {/* Header */}
        <div className={`${content.bgColor} text-white px-6 py-4 rounded-t-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{content.icon}</div>
              <div>
                <h2 className="text-lg font-bold">{content.title}</h2>
                <p className="text-sm opacity-90">{content.subtitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={`p-6 ${content.bgLight}`}>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className={`w-6 h-6 ${content.textColor}`} />
              <h3 className={`font-bold ${content.textColor}`}>Drug Interaction Alert</h3>
            </div>

            <div className="space-y-3">
              <p className={`${content.textColor} font-medium`}>
                {content.message}
              </p>

              {description && (
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-1">Details:</h4>
                  <p className="text-gray-700 text-sm">{description}</p>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                <p className="text-yellow-800 text-sm font-medium">
                  <strong>Important:</strong> {isContraindicated
                    ? "Do not take these medications together under any circumstances. Contact your doctor immediately if you are currently taking both."
                    : "Do not start, stop, or change the dosage of these medications without consulting your healthcare provider first."
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onClose}
              className={`w-full ${content.buttonBg} text-white px-4 py-3 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-4 focus:ring-opacity-50`}
            >
              {content.buttonText}
            </button>

            <p className="text-xs text-gray-600 text-center">
              This warning is based on known drug interactions. Always consult your healthcare provider for personalized medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriticalInteractionModal;