import React, { useState, useEffect } from "react";
import { Search, Database, Package } from "lucide-react";
import { toast } from "react-toastify";

import type { Drug } from "../types";
import { drugAPI } from "../services/api";
import LoadingSpinner from "./LoadingSpinner";

const DrugDatabase: React.FC = () => {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Drug[]>([]);
  const [searching, setSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadDrugs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const loadDrugs = async () => {
    try {
      setLoading(true);
      const response = await drugAPI.getAllDrugs(currentPage, 20);
      setDrugs(response.drugs);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error("Error loading drugs:", error);
      toast.error("Failed to load drugs");
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
      console.error("Error searching drugs:", error);
      toast.error("Failed to search drugs");
    } finally {
      setSearching(false);
    }
  };

  const displayedDrugs = searchQuery.length >= 2 ? searchResults : drugs;

  // Empty state
  const noDrugs = !loading && displayedDrugs.length === 0;

  return (
    <div
      className="max-w-6xl mx-auto space-y-8 py-6 px-2 sm:px-4 md:px-6 bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen"
      role="main"
    >
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 mb-1 drop-shadow">
          💊 Drug Database
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-2xl mx-auto font-medium">
          Browse our comprehensive database of medications including generic
          names, brand names, drug classes, and manufacturer information.
        </p>
      </div>

      {/* Search */}
      <div className="card p-4 sm:p-6 md:p-8 shadow-xl rounded-2xl bg-white/80 backdrop-blur-md border border-blue-100">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
            {searching ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Search className="h-6 w-6 text-blue-400" />
            )}
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search drugs by generic name, brand name, or drug class..."
            className="input pl-12 sm:pl-14 pr-3 sm:pr-4 py-2 sm:py-3 text-base sm:text-lg rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition w-full bg-white/70 shadow-sm"
          />
        </div>

        {searchQuery.length >= 2 && (
          <div className="mt-2 sm:mt-3 text-sm sm:text-base text-blue-700 font-semibold">
            Found {searchResults.length} drugs matching{" "}
            <span className="font-bold">"{searchQuery}"</span>
          </div>
        )}
      </div>

      {/* Results */}
      <div
        className="card shadow-2xl rounded-2xl bg-white/90 border border-purple-100"
        aria-live="polite"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <LoadingSpinner size="lg" />
            <span className="mt-4 text-xl text-purple-600 animate-pulse">
              Loading drugs...
            </span>
          </div>
        ) : noDrugs ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-2xl font-semibold">
            <span className="mb-2">😕</span>
            No drugs found.
          </div>
        ) : (
          <>
            <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-purple-200 bg-gradient-to-r from-blue-100/60 to-purple-100/60 rounded-t-2xl">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-800 flex items-center gap-2">
                <Database className="w-6 sm:w-7 h-6 sm:h-7 mr-2 text-blue-500" />
                {searchQuery.length >= 2 ? "Search Results" : "All Drugs"}
                <span className="ml-2 sm:ml-3 text-base sm:text-lg font-normal text-purple-500">
                  ({displayedDrugs.length} drugs)
                </span>
              </h2>
            </div>

            <div className="divide-y divide-blue-100">
              {displayedDrugs.map((drug) => (
                <div
                  key={drug.id}
                  className="p-4 sm:p-6 md:p-8 hover:bg-blue-50/60 transition-colors rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-4 shadow-sm border-b border-blue-100"
                  tabIndex={0}
                  aria-label={`Drug: ${drug.generic_name}`}
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-900">
                        {drug.generic_name}
                      </h3>
                      <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-blue-200 to-purple-200 text-blue-800 text-xs sm:text-sm font-semibold rounded-full shadow">
                        {drug.drug_class}
                      </span>
                    </div>
                    {drug.description && (
                      <p className="text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base md:text-lg italic">
                        {drug.description}
                      </p>
                    )}
                    {drug.brands && drug.brands.length > 0 && (
                      <div className="flex items-start space-x-1 sm:space-x-2 mt-1 sm:mt-2">
                        <Package className="w-4 sm:w-5 h-4 sm:h-5 text-pink-400 mt-0.5" />
                        <div>
                          <div className="text-xs sm:text-sm font-semibold text-purple-700">
                            Brand Names:
                          </div>
                          <div className="text-xs sm:text-sm text-purple-600 font-medium">
                            {drug.brands.join(", ")}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-right text-xs sm:text-sm text-gray-500 font-mono select-all">
                    <span className="bg-blue-100 px-2 py-1 rounded">
                      ID: {drug.id}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {!searchQuery && totalPages > 1 && (
              <div className="px-4 sm:px-8 py-4 sm:py-6 border-t border-purple-200 flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-4 bg-gradient-to-r from-blue-100/60 to-purple-100/60 rounded-b-2xl">
                <div className="text-sm sm:text-base text-purple-700 font-semibold">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2 sm:space-x-3">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="btn-secondary px-3 sm:px-5 py-2 rounded-lg bg-blue-100 text-blue-700 font-bold shadow hover:bg-blue-200 disabled:opacity-50 transition"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="btn-secondary px-3 sm:px-5 py-2 rounded-lg bg-blue-100 text-blue-700 font-bold shadow hover:bg-blue-200 disabled:opacity-50 transition"
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
