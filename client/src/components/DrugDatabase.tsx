import React, { useState, useEffect } from 'react';
import { Search, Database, Package } from 'lucide-react';
import { toast } from 'react-toastify';

import { Drug } from '../types';
import { drugAPI } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const DrugDatabase: React.FC = () => {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Drug[]>([]);
  const [searching, setSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadDrugs();
  }, [currentPage]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const timeoutId = setTimeout(() => {
        searchDrugs();
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadDrugs = async () => {
    try {
      setLoading(true);
      const response = await drugAPI.getAllDrugs(currentPage, 20);
      setDrugs(response.drugs);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error('Error loading drugs:', error);
      toast.error('Failed to load drugs');
    } finally {
      setLoading(false);
    }
  };

  const searchDrugs = async () => {
    try {
      setSearching(true);
      const response = await drugAPI.searchDrugs(searchQuery, 50);
      setSearchResults(response.results);
    } catch (error) {
      console.error('Error searching drugs:', error);
      toast.error('Failed to search drugs');
    } finally {
      setSearching(false);
    }
  };

  const displayedDrugs = searchQuery.length >= 2 ? searchResults : drugs;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Drug Database
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse our comprehensive database of medications including generic names, 
          brand names, drug classes, and manufacturer information.
        </p>
      </div>

      {/* Search */}
      <div className="card p-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {searching ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Search className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search drugs by generic name, brand name, or drug class..."
            className="input pl-10 pr-4 text-lg"
          />
        </div>
        
        {searchQuery.length >= 2 && (
          <div className="mt-2 text-sm text-gray-600">
            Found {searchResults.length} drugs matching "{searchQuery}"
          </div>
        )}
      </div>

      {/* Results */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="md" />
            <span className="ml-3 text-gray-600">Loading drugs...</span>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Database className="w-5 h-5 mr-2" />
                {searchQuery.length >= 2 ? 'Search Results' : 'All Drugs'}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({displayedDrugs.length} drugs)
                </span>
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {displayedDrugs.map((drug) => (
                <div key={drug.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {drug.generic_name}
                        </h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {drug.drug_class}
                        </span>
                      </div>
                      
                      {drug.description && (
                        <p className="text-gray-600 mb-3">{drug.description}</p>
                      )}
                      
                      {drug.brands && drug.brands.length > 0 && (
                        <div className="flex items-start space-x-2">
                          <Package className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <div className="text-sm font-medium text-gray-700">Brand Names:</div>
                            <div className="text-sm text-gray-600">
                              {drug.brands.join(', ')}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right text-sm text-gray-500">
                      ID: {drug.id}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {!searchQuery && totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DrugDatabase;
