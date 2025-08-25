import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Search, Heart, AlertCircle, Loader2, Activity, TrendingUp } from "lucide-react";

import { conditionsAPI } from "../services/api";
import LoadingSpinner from "./LoadingSpinner";

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

const ConditionsList: React.FC = () => {
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [filteredConditions, setFilteredConditions] = useState<Condition[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);

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
    setSelectedCondition(selectedCondition?.id === condition.id ? null : condition);
  };

  const getSeverityColor = (severity: number) => {
    switch (severity) {
      case 5: return "text-red-600 bg-red-100";
      case 4: return "text-orange-600 bg-orange-100";
      case 3: return "text-yellow-600 bg-yellow-100";
      case 2: return "text-blue-600 bg-blue-100";
      case 1: return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getSeverityLabel = (severity: number) => {
    switch (severity) {
      case 5: return "Critical";
      case 4: return "Severe";
      case 3: return "Moderate";
      case 2: return "Mild";
      case 1: return "Minor";
      default: return "Unknown";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6 px-2 sm:px-4 md:px-8 bg-gradient-to-br from-green-50 to-blue-100 min-h-screen">
      {/* Header */}
      <div className="text-center mb-2 sm:mb-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-700 via-blue-600 to-purple-500 mb-1 sm:mb-2 drop-shadow">
          Medical Conditions Database
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-2xl mx-auto font-medium">
          Browse and search through our comprehensive database of medical conditions 
          with detailed descriptions and information.
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
            Found {filteredConditions.length} condition(s) matching "{searchTerm}"
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
              className={`
                bg-white rounded-lg shadow-md border hover:shadow-lg transition-all cursor-pointer p-4
                ${selectedCondition?.id === condition.id 
                  ? 'border-green-500 ring-2 ring-green-200 bg-green-50' 
                  : 'border-gray-200 hover:border-green-300'
                }
              `}
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
                  <div className="flex items-center gap-2 text-xs">
                    <Activity className="w-3 h-3 text-green-600" />
                    <span className="text-green-700 font-medium">
                      {condition.symptoms?.length || 0} symptom{condition.symptoms?.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedCondition?.id === condition.id && (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-green-800">Full Description:</h4>
                      <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                        {condition.description}
                      </p>
                    </div>
                    
                    {/* Symptoms Section */}
                    {condition.symptoms && condition.symptoms.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          Associated Symptoms ({condition.symptoms.length})
                        </h4>
                        <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                          {condition.symptoms.map((symptom) => (
                            <div 
                              key={symptom.id} 
                              className="flex items-start justify-between p-2 bg-white rounded border border-gray-200"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-900">
                                    {symptom.name}
                                  </span>
                                  <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(symptom.severity)}`}>
                                    {getSeverityLabel(symptom.severity)}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {symptom.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-green-600 pt-2 border-t border-green-100">
                      <span>Condition ID: {condition.id}</span>
                      <span className="bg-green-100 px-2 py-1 rounded">
                        Click to collapse
                      </span>
                    </div>
                  </div>
                </div>
              )}
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
              : "No conditions available in the database"
            }
          </p>
        </div>
      )}

      {/* Summary Stats */}
      {!loading && filteredConditions.length > 0 && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-sm border border-green-200">
            <Heart className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              {filteredConditions.length} medical condition{filteredConditions.length !== 1 ? 's' : ''} 
              {searchTerm ? ` found` : ' available'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConditionsList;