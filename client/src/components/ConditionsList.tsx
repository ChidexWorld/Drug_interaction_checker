import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Search,
  Heart,
  AlertCircle,
  Activity,
  X,
} from "lucide-react";

import { conditionsAPI } from "../services/api";
import LoadingSpinner from "./LoadingSpinner";
import ConditionDescription from "./ConditionDescription";

interface Symptom {
  id: number;
  name: string;
  description: string;
  severity: number;
}

interface Condition {
  id: number;
  name: string;
  description: string;
  symptoms: Symptom[];
}

// Modal Component
const ConditionModal: React.FC<{
  condition: Condition | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ condition, isOpen, onClose }) => {
  

  if (!isOpen || !condition) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {condition.name}
                </h2>
                <p className="text-green-100 text-sm">
                  Medical Condition Details
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-green-600" />
                Description
              </h3>
              <ConditionDescription condition={condition}/>
            </div>

            {/* Symptoms Section */}
            {condition.symptoms && condition.symptoms.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Associated Symptoms
                  <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                    {condition.symptoms.length}
                  </span>
                </h3>

                <div className="grid gap-3">
                  {condition.symptoms.map((symptom) => (
                    <div
                      key={symptom.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 flex-1">
                          {symptom.name}
                        </h4>
                      </div>
                      {symptom.description && (
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {symptom.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Symptoms */}
            {(!condition.symptoms || condition.symptoms.length === 0) && (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  No symptoms information available for this condition.
                </p>
              </div>
            )}

            {/* Footer Info */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Condition ID: {condition.id}</span>
                <span className="bg-green-50 text-green-700 px-2 py-1 rounded">
                  Medical Database
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConditionsList: React.FC = () => {
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [filteredConditions, setFilteredConditions] = useState<Condition[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadConditions();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredConditions(conditions);
    } else {
      const filtered = conditions.filter(
        (condition) =>
          condition.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          condition.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredConditions(filtered);
    }
  }, [searchTerm, conditions]);

  const loadConditions = async () => {
    try {
      setLoading(true);
      const response = await conditionsAPI.getAllConditions();
      setConditions(response.conditions);
      setFilteredConditions(response.conditions);
      toast.success(`Loaded ${response.total} medical conditions`);
    } catch (error) {
      console.error("Error loading conditions:", error);
      toast.error("Failed to load conditions");
    } finally {
      setLoading(false);
    }
  };

  const handleConditionClick = (condition: Condition) => {
    setSelectedCondition(condition);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCondition(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-blue-100 min-h-screen">
      {/* Header */}
      <div className="text-center mb-2 sm:mb-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-700 via-blue-600 to-purple-500 mb-1 sm:mb-2 drop-shadow">
          Medical Conditions Database
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-2xl mx-auto font-medium">
          Browse and search through our comprehensive database of medical
          conditions with detailed descriptions and information.
        </p>
      </div>

      {/* Search Section */}
      <div className="card p-4 sm:p-6 md:p-8 shadow-xl rounded-2xl bg-white/80 backdrop-blur-md border border-green-100">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-6 h-6 text-green-600" />
          <h2 className="text-lg sm:text-xl font-bold text-green-900">
            Search Medical Conditions
          </h2>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conditions by name or description..."
            className="w-full pl-10 pr-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
          />
        </div>

        {searchTerm && (
          <div className="mt-2 text-sm text-gray-600">
            Found {filteredConditions.length} condition(s) matching "
            {searchTerm}"
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 mt-4">Loading medical conditions...</p>
        </div>
      )}

      {/* Conditions Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredConditions.map((condition) => (
            <div
              key={condition.id}
              onClick={() => handleConditionClick(condition)}
              className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:border-green-300 transition-all cursor-pointer p-4 transform hover:scale-105"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">
                    {condition.name}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {condition.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <Activity className="w-3 h-3 text-green-600" />
                      <span className="text-green-700 font-medium">
                        {condition.symptoms?.length || 0} symptom
                        {condition.symptoms?.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded font-medium">
                      Click to view
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && filteredConditions.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No conditions found
          </h3>
          <p className="text-gray-600">
            {searchTerm
              ? `No conditions match your search for "${searchTerm}"`
              : "No conditions available in the database"}
          </p>
        </div>
      )}

      {/* Summary Stats */}
      {!loading && filteredConditions.length > 0 && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-sm border border-green-200">
            <Heart className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              {filteredConditions.length} medical condition
              {filteredConditions.length !== 1 ? "s" : ""}
              {searchTerm ? ` found` : " available"}
            </span>
          </div>
        </div>
      )}

      {/* Modal */}
      <ConditionModal
        condition={selectedCondition}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ConditionsList;
