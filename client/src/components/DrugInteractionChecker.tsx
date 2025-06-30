import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { AlertTriangle, Search, X, Plus } from 'lucide-react';

import { Drug, Condition, InteractionCheckResponse } from '../types';
import { drugAPI, interactionAPI, conditionAPI } from '../services/api';
import DrugSelect from './DrugSelect';
import ConditionSelect from './ConditionSelect';
import InteractionResults from './InteractionResults';
import LoadingSpinner from './LoadingSpinner';

const DrugInteractionChecker: React.FC = () => {
  const [selectedDrugs, setSelectedDrugs] = useState<Drug[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [interactionResults, setInteractionResults] = useState<InteractionCheckResponse | null>(null);
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
      console.error('Error loading conditions:', error);
      toast.error('Failed to load conditions');
    } finally {
      setConditionsLoading(false);
    }
  };

  const handleDrugSelect = (drug: Drug) => {
    if (selectedDrugs.find(d => d.id === drug.id)) {
      toast.warning('Drug already selected');
      return;
    }
    
    if (selectedDrugs.length >= 10) {
      toast.warning('Maximum 10 drugs can be selected');
      return;
    }

    setSelectedDrugs(prev => [...prev, drug]);
    
    // Auto-check interactions if we have 2 or more drugs
    if (selectedDrugs.length >= 1) {
      setTimeout(() => checkInteractions([...selectedDrugs, drug]), 500);
    }
  };

  const handleDrugRemove = (drugId: number) => {
    const newSelectedDrugs = selectedDrugs.filter(drug => drug.id !== drugId);
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

  const checkInteractions = async (drugs: Drug[] = selectedDrugs, condition: Condition | null = selectedCondition) => {
    if (drugs.length < 2) {
      setInteractionResults(null);
      return;
    }

    try {
      setLoading(true);
      const drugIds = drugs.map(drug => drug.id);
      const response = await interactionAPI.checkInteractions(
        drugIds,
        condition?.id
      );
      setInteractionResults(response);
      
      // Show toast based on results
      if (response.summary.total_interactions === 0) {
        toast.success('No known interactions found');
      } else if (response.summary.max_severity >= 3) {
        toast.error(`${response.summary.risk_level} interactions found!`);
      } else if (response.summary.max_severity >= 2) {
        toast.warning(`${response.summary.risk_level} interactions found`);
      } else {
        toast.info(`${response.summary.risk_level} interactions found`);
      }
    } catch (error) {
      console.error('Error checking interactions:', error);
      toast.error('Failed to check interactions');
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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Drug Interaction Checker
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Check for harmful interactions between medications. Select drugs and optionally 
          specify a medical condition for condition-aware severity adjustments.
        </p>
      </div>

      {/* Drug Selection */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Select Drugs to Check
          </h2>
          {selectedDrugs.length > 0 && (
            <button
              onClick={clearAll}
              className="btn-secondary text-sm"
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
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Selected Drugs ({selectedDrugs.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedDrugs.map((drug) => (
                <div
                  key={drug.id}
                  className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm"
                >
                  <span className="font-medium">{drug.generic_name}</span>
                  <span className="text-primary-500">({drug.drug_class})</span>
                  <button
                    onClick={() => handleDrugRemove(drug.id)}
                    className="text-primary-500 hover:text-primary-700"
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
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Patient Condition (Optional)
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Select a medical condition to get condition-aware interaction severity adjustments.
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
            className="btn-primary inline-flex items-center gap-2"
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
      <InteractionResults
        results={interactionResults}
        loading={loading}
      />

      {/* Help Text */}
      {selectedDrugs.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Start by selecting drugs
          </h3>
          <p className="text-gray-600">
            Search and select at least 2 drugs to check for interactions.
          </p>
        </div>
      )}

      {selectedDrugs.length === 1 && (
        <div className="text-center py-8">
          <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">
            Select one more drug to check for interactions.
          </p>
        </div>
      )}
    </div>
  );
};

export default DrugInteractionChecker;
