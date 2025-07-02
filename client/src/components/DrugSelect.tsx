import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import type { Drug, DrugSelectProps } from "../types";
import { drugAPI } from "../services/api";

const DrugSelect: React.FC<DrugSelectProps> = ({
  onDrugSelect,
  selectedDrugs,
  placeholder = "Search for drugs...",
}) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchDrugs(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchDrugs = async (searchQuery: string) => {
    try {
      setLoading(true);
      const response = await drugAPI.searchDrugs(searchQuery, 10);
      setSearchResults(response.results);
      setShowDropdown(true);
      setHighlightedIndex(-1);
    } catch (error) {
      console.error("Error searching drugs:", error);
      toast.error("Failed to search drugs");
      setSearchResults([]);
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleDrugSelect = (drug: Drug) => {
    onDrugSelect(drug);
    setQuery("");
    setSearchResults([]);
    setShowDropdown(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || searchResults.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < searchResults.length) {
          handleDrugSelect(searchResults[highlightedIndex]);
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const isSelected = (drug: Drug) => {
    return selectedDrugs.some((selected) => selected.id === drug.id);
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading ? (
            <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-4 w-4 text-gray-400" />
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setShowDropdown(true)}
          placeholder={placeholder}
          className="input pl-10 pr-4"
          autoComplete="off"
        />
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none"
        >
          {searchResults.length === 0 && !loading && (
            <div className="px-4 py-2 text-sm text-gray-500">
              No drugs found for "{query}"
            </div>
          )}

          {searchResults.map((drug, index) => (
            <button
              key={drug.id}
              onClick={() => handleDrugSelect(drug)}
              disabled={isSelected(drug)}
              className={`
                w-full text-left px-4 py-2 text-sm transition-colors
                ${
                  highlightedIndex === index
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-900 hover:bg-gray-50"
                }
                ${
                  isSelected(drug)
                    ? "opacity-50 cursor-not-allowed bg-gray-50"
                    : "cursor-pointer"
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{drug.generic_name}</div>
                  <div className="text-xs text-gray-500">{drug.drug_class}</div>
                  {drug.brands && drug.brands.length > 0 && (
                    <div className="text-xs text-gray-400 mt-1">
                      Brands: {drug.brands.slice(0, 2).join(", ")}
                      {drug.brands.length > 2 &&
                        ` +${drug.brands.length - 2} more`}
                    </div>
                  )}
                </div>
                {isSelected(drug) && (
                  <div className="text-xs text-green-600 font-medium">
                    Selected
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DrugSelect;
