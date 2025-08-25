import React from "react";
import { Pill, Building2, Info } from "lucide-react";
import type { Drug } from "../types";

interface DrugDetailsProps {
  drug: Drug;
}

const DrugDetails: React.FC<DrugDetailsProps> = ({ drug }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-blue-200 p-6 space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Pill className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-blue-900">{drug.generic_name}</h3>
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {drug.drug_class}
          </span>
        </div>
      </div>

      {drug.description && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-gray-600" />
            <h4 className="font-semibold text-gray-800">Description</h4>
          </div>
          <p className="text-gray-700 leading-relaxed pl-6">{drug.description}</p>
        </div>
      )}

      {drug.brands && drug.brands.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-600" />
            <h4 className="font-semibold text-gray-800">Brand Names</h4>
          </div>
          <div className="pl-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {drug.brands.map((brand, index) => (
                <div
                  key={index}
                  className="flex flex-col bg-gray-50 rounded-lg p-3 border"
                >
                  <span className="font-medium text-gray-900">{brand}</span>
                  {drug.manufacturers && drug.manufacturers[index] && (
                    <span className="text-sm text-gray-600">
                      by {drug.manufacturers[index]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This information is for educational purposes only. 
          Always consult with a healthcare professional before starting, stopping, 
          or changing any medication.
        </p>
      </div>
    </div>
  );
};

export default DrugDetails;