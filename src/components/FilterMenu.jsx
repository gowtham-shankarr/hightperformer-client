import React, { useState,useRef } from 'react';
import { VscFilter } from "react-icons/vsc";
import useOutsideClick from '../utils/useOutsideClick'
const FilterMenu = () => {
  const [filters, setFilters] = useState([]);
  const [showAttributeDropdown, setShowAttributeDropdown] = useState(false);
  const [showConditionDropdownIndex, setShowConditionDropdownIndex] = useState(null);
  const dropdownRef = useRef(null);
  const attributeOptions = {
    Name: ['contains', 'not contains', 'starts with', 'ends with', 'is', 'is not', 'empty', 'not empty'],
    Domains: ['contains', 'not contains', 'starts with', 'ends with', 'is', 'is not', 'empty', 'not empty'],
  };

  const addFilter = () => {
    setShowAttributeDropdown(true);
  };

  useOutsideClick(dropdownRef, () => {
    if (showAttributeDropdown) {
        setShowAttributeDropdown(false);
    }
  });

  const selectAttribute = (attribute) => {
    setShowAttributeDropdown(false);
    setShowConditionDropdownIndex(filters.length);
    setFilters([...filters, { attribute, condition: '', value: '' }]);
  };

  const selectCondition = (index, condition) => {
    setShowConditionDropdownIndex(null);
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], condition, value: '' };
    setFilters(newFilters);
  };

  const updateValue = (index, value) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], value };
    setFilters(newFilters);
  };

  const removeFilter = (index) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    setFilters(newFilters);
    setShowConditionDropdownIndex(null);
  };

  return (
    <div className="space-y-4" ref={dropdownRef}>

      {filters.map((filter, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div className="font-semibold">{filter.attribute}</div>

          <div className="relative">
            <button
              onClick={() => setShowConditionDropdownIndex(index)}
              className="bg-gray-200 py-1 px-3 rounded-md"
            >
              {filter.condition || 'Select condition'}
            </button>

            {showConditionDropdownIndex === index && (
              <div className="absolute z-10 mt-2 bg-white border rounded shadow-lg py-1">
                {attributeOptions[filter.attribute].map((condition) => (
                  <div
                    key={condition}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => selectCondition(index, condition)}
                  >
                    {condition}
                  </div>
                ))}
              </div>
            )}
          </div>

          {filter.condition && (
            <input
              type="text"
              value={filter.value}
              onChange={(e) => updateValue(index, e.target.value)}
              className="border py-1 px-3 rounded-md"
              placeholder="Enter value"
            />
          )}

          <button onClick={() => removeFilter(index)} className="text-red-500">
            &times; Remove
          </button>
        </div>
      ))}

<div className="relative">
        <button onClick={addFilter} className="bg-blue-500 text-white py-2 px-4 rounded-md filter-btn">
          <VscFilter /> &nbsp; Filter
        </button>

        {showAttributeDropdown && (
          <div className="absolute z-10 mt-2 bg-white border rounded shadow-lg py-1">
            {Object.keys(attributeOptions).map((attribute) => (
              <div
                key={attribute}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => selectAttribute(attribute)}
              >
                {attribute}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterMenu;
