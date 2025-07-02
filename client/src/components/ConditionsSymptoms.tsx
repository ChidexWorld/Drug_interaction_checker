import React, { useState, useEffect } from "react";
import { Stethoscope, Activity, Search } from "lucide-react";
import { toast } from "react-toastify";

import type { Condition, Symptom } from "../types";
import { conditionAPI, symptomAPI } from "../services/api";
import LoadingSpinner from "./LoadingSpinner";

const ConditionsSymptoms: React.FC = () => {
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"conditions" | "symptoms">(
    "conditions"
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [conditionsResponse, symptomsResponse] = await Promise.all([
        conditionAPI.getAllConditions(),
        symptomAPI.getAllSymptoms(),
      ]);
      setConditions(conditionsResponse.conditions);
      setSymptoms(symptomsResponse.symptoms);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load conditions and symptoms");
    } finally {
      setLoading(false);
    }
  };

  const filteredConditions = conditions.filter(
    (condition) =>
      condition.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      condition.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSymptoms = symptoms.filter(
    (symptom) =>
      symptom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      symptom.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-2 sm:px-4 md:px-8">
        <div className="flex flex-col items-center justify-center py-16">
          <LoadingSpinner size="lg" />
          <span className="mt-4 text-xl text-purple-600 animate-pulse">
            Loading conditions and symptoms...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 px-2 sm:px-4 md:px-8 bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen">
      {/* Header */}
      <div className="text-center mb-2 sm:mb-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 mb-1 sm:mb-2 drop-shadow">
          Conditions & Symptoms
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-2xl mx-auto font-medium">
          Browse medical conditions and their associated symptoms. Understanding
          these relationships helps in providing condition-aware drug
          interaction alerts.
        </p>
      </div>

      {/* Search */}
      <div className="card p-4 sm:p-6 md:p-8 shadow-xl rounded-2xl bg-white/80 backdrop-blur-md border border-blue-100">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-blue-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conditions or symptoms..."
            className="input pl-10 pr-4 py-2 sm:py-3 text-base sm:text-lg rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition w-full bg-white/70 shadow-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="card shadow-2xl rounded-2xl bg-white/90 border border-purple-100">
        <div className="border-b border-purple-200 bg-gradient-to-r from-blue-100/60 to-purple-100/60 rounded-t-2xl">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("conditions")}
              className={`py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base font-semibold border-b-2 transition-colors focus:outline-none ${
                activeTab === "conditions"
                  ? "border-blue-500 text-blue-700 bg-white/80"
                  : "border-transparent text-gray-500 hover:text-blue-700 hover:bg-blue-50/60"
              }`}
            >
              <Stethoscope className="w-4 h-4 inline mr-2" />
              Conditions ({filteredConditions.length})
            </button>
            <button
              onClick={() => setActiveTab("symptoms")}
              className={`py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base font-semibold border-b-2 transition-colors focus:outline-none ${
                activeTab === "symptoms"
                  ? "border-blue-500 text-blue-700 bg-white/80"
                  : "border-transparent text-gray-500 hover:text-blue-700 hover:bg-blue-50/60"
              }`}
            >
              <Activity className="w-4 h-4 inline mr-2" />
              Symptoms ({filteredSymptoms.length})
            </button>
          </nav>
        </div>

        {/* Conditions Tab */}
        {activeTab === "conditions" && (
          <div className="flex flex-col gap-5">
            {filteredConditions.map((condition) => (
              <div
                key={condition.id}
                className="p-4 sm:p-6 md:p-8 hover:bg-blue-50/60 transition-colors rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-sm border border-blue-100"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                    <h3 className="text-lg sm:text-xl font-bold text-blue-900">
                      {condition.name}
                    </h3>
                    <span
                      className={`px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-semibold rounded-full shadow ${
                        condition.severity_level === 3
                          ? "bg-red-100 text-red-800"
                          : condition.severity_level === 2
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {condition.severity_level === 3
                        ? "High Risk"
                        : condition.severity_level === 2
                        ? "Moderate Risk"
                        : "Low Risk"}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base md:text-lg italic">
                    {condition.description}
                  </p>
                  {condition.symptoms && condition.symptoms.length > 0 && (
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-purple-700 mb-1">
                        Associated Symptoms:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {(Array.isArray(condition.symptoms)
                          ? condition.symptoms.slice(0, 5)
                          : String(condition.symptoms || "")
                              .split(",")
                              .slice(0, 5)
                        ).map((symptom, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {typeof symptom === "string"
                              ? symptom.trim()
                              : symptom &&
                                typeof symptom === "object" &&
                                "name" in symptom
                              ? symptom.name
                              : ""}
                          </span>
                        ))}
                        {(Array.isArray(condition.symptoms)
                          ? condition.symptoms.length
                          : String(condition.symptoms || "").split(",")
                              .length) > 5 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +
                            {(Array.isArray(condition.symptoms)
                              ? condition.symptoms.length
                              : String(condition.symptoms || "").split(",")
                                  .length) - 5}{" "}
                            more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-right text-xs sm:text-sm text-gray-500 font-mono select-all">
                  <span className="bg-blue-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                    ID: {condition.id}
                  </span>
                </div>
              </div>
            ))}
            {filteredConditions.length === 0 && (
              <div className="flex justify-center">
                <div className="p-8 w-full max-w-md text-center text-gray-400 text-base font-semibold bg-white/80 rounded-2xl shadow-lg flex flex-col items-center gap-2">
                  <Stethoscope className="w-8 h-8 mb-2 text-blue-200" />
                  No conditions found matching your search.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Symptoms Tab */}
        {activeTab === "symptoms" && (
          <div className="flex flex-col gap-5">
            {filteredSymptoms.map((symptom) => (
              <div
                key={symptom.id}
                className="p-4 sm:p-6 md:p-8 hover:bg-green-50/60 transition-colors rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-sm border border-green-100"
              >
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-green-900 mb-2">
                    {symptom.name}
                  </h3>
                  <p className="text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base md:text-lg italic">
                    {symptom.description}
                  </p>
                  {symptom.related_conditions &&
                    symptom.related_conditions.length > 0 && (
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-blue-700 mb-1">
                          Related Conditions:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(symptom.related_conditions)
                            ? symptom.related_conditions.slice(0, 5)
                            : String(symptom.related_conditions || "")
                                .split(",")
                                .slice(0, 5)
                          ).map((condition, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                            >
                              {typeof condition === "string"
                                ? condition.trim()
                                : condition &&
                                  typeof condition === "object" &&
                                  "name" in condition
                                ? condition.name
                                : ""}
                            </span>
                          ))}
                          {(Array.isArray(symptom.related_conditions)
                            ? symptom.related_conditions.length
                            : String(symptom.related_conditions || "").split(
                                ","
                              ).length) > 5 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +
                              {(Array.isArray(symptom.related_conditions)
                                ? symptom.related_conditions.length
                                : String(
                                    symptom.related_conditions || ""
                                  ).split(",").length) - 5}{" "}
                              more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                </div>
                <div className="text-right text-xs sm:text-sm text-gray-500 font-mono select-all">
                  <span className="bg-green-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                    ID: {symptom.id}
                  </span>
                </div>
              </div>
            ))}
            {filteredSymptoms.length === 0 && (
              <div className="flex justify-center">
                <div className="p-8 w-full max-w-md text-center text-gray-400 text-base font-semibold bg-white/80 rounded-2xl shadow-lg flex flex-col items-center gap-2">
                  <Activity className="w-8 h-8 mb-2 text-green-200" />
                  No symptoms found matching your search.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Footer */}
      <footer className="mt-10 sm:mt-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-2xl bg-gradient-to-r from-blue-100/80 via-purple-100/80 to-pink-100/80 shadow-lg border border-blue-200/40 backdrop-blur-md py-6 px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm sm:text-base text-blue-900 font-semibold text-center sm:text-left">
              © {new Date().getFullYear()} Precious Drug Interaction Checker
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-purple-700 font-medium">
              <span>Made with</span>
              <span className="text-pink-500 text-lg">♥</span>
              <span>by Chidex-World</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ConditionsSymptoms;
