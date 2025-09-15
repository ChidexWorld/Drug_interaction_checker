import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import { drugInteractionAPI } from "../services/api";

interface Condition {
  id: number;
  name: string;
  description?: string;
}

interface ConditionAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

const ConditionAutocomplete: React.FC<ConditionAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Enter condition name...",
  label,
}) => {
  const [searchResults, setSearchResults] = useState<Condition[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Predefined conditions based on your database
  const knownConditions = [
    "Hypertension",
    "Diabetes Mellitus",
    "Asthma",
    "Chronic Kidney Disease (CKD)",
    "Liver Disease",
    "Pregnancy",
    "Peptic Ulcer Disease (PUD)",
    "HIV/AIDS",
    "Parkinson's Disease",
    "Systemic Lupus Erythematosus (SLE)",
  ];

  // Debounced search
  useEffect(() => {
    if (value.length < 1) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchConditions(value);
    }, 200);

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

  const searchConditions = async (searchQuery: string) => {
    try {
      setLoading(true);

      // Filter known conditions first
      const filtered = knownConditions
        .filter(condition =>
          condition.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((name, index) => ({ id: index, name }));

      setSearchResults(filtered);
      setShowDropdown(true);
      setHighlightedIndex(-1);
    } catch (error) {
      console.error("Error searching conditions:", error);
      setSearchResults([]);
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleConditionSelect = (condition: Condition) => {
    // Handle multi-condition input - append to existing value
    const currentConditions = value
      .split(",")
      .map(c => c.trim())
      .filter(c => c.length > 0);

    // Remove the last incomplete condition and add the selected one
    const lastCommaIndex = value.lastIndexOf(",");
    const beforeLastComma = lastCommaIndex >= 0 ? value.substring(0, lastCommaIndex + 1) + " " : "";
    const newValue = beforeLastComma + condition.name;

    onChange(newValue);
    setSearchResults([]);
    setShowDropdown(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || searchResults.length === 0) {
      // Handle comma for multiple conditions
      if (e.key === "," || e.key === "Enter") {
        const trimmedValue = value.trim();
        if (trimmedValue && !trimmedValue.endsWith(",")) {
          onChange(trimmedValue + ", ");
          e.preventDefault();
        }
      }
      return;
    }

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
          handleConditionSelect(searchResults[highlightedIndex]);
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setHighlightedIndex(-1);
        break;
      case ",":
        if (highlightedIndex >= 0 && highlightedIndex < searchResults.length) {
          e.preventDefault();
          handleConditionSelect(searchResults[highlightedIndex]);
        }
        break;
    }
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
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
          onFocus={() => value.length >= 1 && setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          autoComplete="off"
        />
      </div>

      {/* Dropdown */}
      {showDropdown && searchResults.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none"
        >
          {searchResults.map((condition, index) => (
            <button
              key={condition.id}
              onClick={() => handleConditionSelect(condition)}
              className={`
                w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer
                ${
                  highlightedIndex === index
                    ? "bg-gray-50 text-gray-700"
                    : "text-gray-900 hover:bg-gray-50"
                }
              `}
            >
              <div className="font-medium">{condition.name}</div>
            </button>
          ))}
        </div>
      )}

      {value && (
        <p className="text-xs text-gray-600 mt-1">
          Use commas to separate multiple conditions. Press Enter or comma after each condition.
        </p>
      )}
    </div>
  );
};

export default ConditionAutocomplete;