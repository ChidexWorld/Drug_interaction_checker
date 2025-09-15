import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import type { Drug } from "../types";
import { drugAPI } from "../services/api";

interface DrugAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

const DrugAutocomplete: React.FC<DrugAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Enter drug name...",
  label,
  required = false,
}) => {
  const [searchResults, setSearchResults] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (value.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchDrugs(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [value]);

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
    onChange(e.target.value);
  };

  const handleDrugSelect = (drug: Drug) => {
    onChange(drug.generic_name);
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

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && "*"}
        </label>
      )}
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
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => value.length >= 2 && setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-10 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
              No drugs found for "{value}"
            </div>
          )}

          {searchResults.map((drug, index) => (
            <button
              key={drug.id}
              onClick={() => handleDrugSelect(drug)}
              className={`
                w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer
                ${
                  highlightedIndex === index
                    ? "bg-red-50 text-red-700"
                    : "text-gray-900 hover:bg-gray-50"
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
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DrugAutocomplete;