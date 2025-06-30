import React, { useState, useEffect } from 'react';
import { Stethoscope, Activity, Search } from 'lucide-react';
import { toast } from 'react-toastify';

import { Condition, Symptom } from '../types';
import { conditionAPI, symptomAPI } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const ConditionsSymptoms: React.FC = () => {
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'conditions' | 'symptoms'>('conditions');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [conditionsResponse, symptomsResponse] = await Promise.all([
        conditionAPI.getAllConditions(),
        symptomAPI.getAllSymptoms()
      ]);
      setConditions(conditionsResponse.conditions);
      setSymptoms(symptomsResponse.symptoms);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load conditions and symptoms');
    } finally {
      setLoading(false);
    }
  };

  const filteredConditions = conditions.filter(condition =>
    condition.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    condition.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSymptoms = symptoms.filter(symptom =>
    symptom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    symptom.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="md" />
          <span className="ml-3 text-gray-600">Loading conditions and symptoms...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Conditions & Symptoms
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse medical conditions and their associated symptoms. Understanding these 
          relationships helps in providing condition-aware drug interaction alerts.
        </p>
      </div>

      {/* Search */}
      <div className="card p-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conditions or symptoms..."
            className="input pl-10 pr-4"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('conditions')}
              className={`
                py-4 px-6 text-sm font-medium border-b-2 transition-colors
                ${activeTab === 'conditions'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Stethoscope className="w-4 h-4 inline mr-2" />
              Conditions ({filteredConditions.length})
            </button>
            <button
              onClick={() => setActiveTab('symptoms')}
              className={`
                py-4 px-6 text-sm font-medium border-b-2 transition-colors
                ${activeTab === 'symptoms'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Activity className="w-4 h-4 inline mr-2" />
              Symptoms ({filteredSymptoms.length})
            </button>
          </nav>
        </div>

        {/* Conditions Tab */}
        {activeTab === 'conditions' && (
          <div className="divide-y divide-gray-200">
            {filteredConditions.map((condition) => (
              <div key={condition.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {condition.name}
                      </h3>
                      <span className={`
                        px-2 py-1 text-xs font-medium rounded-full
                        ${condition.severity_level === 3 
                          ? 'bg-red-100 text-red-800' 
                          : condition.severity_level === 2 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                        }
                      `}>
                        {condition.severity_level === 3 ? 'High Risk' : 
                         condition.severity_level === 2 ? 'Moderate Risk' : 'Low Risk'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{condition.description}</p>
                    
                    {condition.symptoms && condition.symptoms.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">
                          Associated Symptoms:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(condition.symptoms) 
                            ? condition.symptoms.slice(0, 5)
                            : condition.symptoms.split(',').slice(0, 5)
                          ).map((symptom, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {typeof symptom === 'string' ? symptom : symptom.name}
                            </span>
                          ))}
                          {(Array.isArray(condition.symptoms) 
                            ? condition.symptoms.length 
                            : condition.symptoms.split(',').length) > 5 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{(Array.isArray(condition.symptoms) 
                                ? condition.symptoms.length 
                                : condition.symptoms.split(',').length) - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right text-sm text-gray-500">
                    ID: {condition.id}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredConditions.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No conditions found matching your search.
              </div>
            )}
          </div>
        )}

        {/* Symptoms Tab */}
        {activeTab === 'symptoms' && (
          <div className="divide-y divide-gray-200">
            {filteredSymptoms.map((symptom) => (
              <div key={symptom.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {symptom.name}
                    </h3>
                    
                    <p className="text-gray-600 mb-3">{symptom.description}</p>
                    
                    {symptom.related_conditions && symptom.related_conditions.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">
                          Related Conditions:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(symptom.related_conditions) 
                            ? symptom.related_conditions.slice(0, 5)
                            : symptom.related_conditions.split(',').slice(0, 5)
                          ).map((condition, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                            >
                              {typeof condition === 'string' ? condition : condition.name}
                            </span>
                          ))}
                          {(Array.isArray(symptom.related_conditions) 
                            ? symptom.related_conditions.length 
                            : symptom.related_conditions.split(',').length) > 5 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{(Array.isArray(symptom.related_conditions) 
                                ? symptom.related_conditions.length 
                                : symptom.related_conditions.split(',').length) - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right text-sm text-gray-500">
                    ID: {symptom.id}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredSymptoms.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No symptoms found matching your search.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConditionsSymptoms;
