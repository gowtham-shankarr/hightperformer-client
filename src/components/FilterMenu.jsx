import React, { useState, useRef, useEffect } from "react";
import { VscFilter } from "react-icons/vsc";
import useOutsideClick from "../utils/useOutsideClick";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiDeleteBinLine } from "react-icons/ri";

const FilterMenu = ({ onFilterChange }) => {
  const [filters, setFilters] = useState([]);
  const [showAttributeDropdown, setShowAttributeDropdown] = useState(false);
  const [showConditionDropdownIndex, setShowConditionDropdownIndex] =
    useState(null);
  const [selectedAttributeIndex, setSelectedAttributeIndex] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const attributeOptions = {
    "company name": [
      "contains",
      "not contains",
      "starts with",
      "ends with",
      "is",
      "is not",
      "empty",
      "not empty",
    ],
    domains: [
      "contains",
      "not contains",
      "starts with",
      "ends with",
      "is",
      "is not",
      "empty",
      "not empty",
    ],
    "linked In": [
      "contains",
      "not contains",
      "starts with",
      "ends with",
      "is",
      "is not",
      "empty",
      "not empty",
    ],
    twitter: [
      "contains",
      "not contains",
      "starts with",
      "ends with",
      "is",
      "is not",
      "empty",
      "not empty",
    ],
    categories: [
      "contains",
      "not contains",
      "starts with",
      "ends with",
      "is",
      "is not",
      "empty",
      "not empty",
    ],
    "twitter follwers": [
      "contains",
      "not contains",
      "starts with",
      "ends with",
      "is",
      "is not",
      "empty",
      "not empty",
    ],
    description: [
      "contains",
      "not contains",
      "starts with",
      "ends with",
      "is",
      "is not",
      "empty",
      "not empty",
    ],
  };

  const [searchTerms, setSearchTerms] = useState({
    companyName: "",
    domains: "",
    linkedIn: "",
    twitter: "",
    categories: "",
    twitterFollower: "",
    description: "",
  });

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleToggleDropdown = (index) => {
    setActiveDropdown(index === activeDropdown ? null : index);
  };

  useOutsideClick(dropdownRef, () => {
    setActiveDropdown(null);
  });

  const [searchTerm, setSearchTerm] = useState("");

  const handleAttributeClick = (index) => {
    if (selectedAttributeIndex === index) {
      setSelectedAttributeIndex(null);
      setShowAttributeDropdown(false);
    } else {
      setSelectedAttributeIndex(index);
      setShowAttributeDropdown(true);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredAttributes = Object.keys(attributeOptions).filter((attr) =>
    attr.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOutsideClick = (event) => {
    if (!event.target.closest(".filter-item")) {
      setShowDropdown(false);
    }
  };

  const handleSearchChange = (column, value) => {
    const newSearchTerms = { ...searchTerms, [column]: value };
    setSearchTerms(newSearchTerms);
    updateFilters(column, value);
  };

  const updateFilters = (column, value) => {
    let newFilters = filters.filter((filter) => filter.attribute !== column);
    if (value) {
      newFilters.push({
        attribute: column,
        condition: "contains",
        value: value,
      });
    }
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const applyFilters = () => {
    const formattedFilters = filters.map((filter) => ({
      column: filter.attribute,
      condition: filter.condition,
      value: filter.value,
    }));
    onFilterChange(formattedFilters);
  };

  const addFilter = () => {
    setShowAttributeDropdown(true);
  };

  useOutsideClick(dropdownRef, () => {
    if (showAttributeDropdown) {
      setShowAttributeDropdown(false);
    }
    if (showConditionDropdownIndex) {
      setShowConditionDropdownIndex(false);
    }
    // if(showDropdown) {
    //   setShowDropdown(false);
    // }
  });

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const selectAttribute = (attribute) => {
    setShowAttributeDropdown(false);
    setShowConditionDropdownIndex(filters.length);
    setFilters([...filters, { attribute, condition: "", value: "" }]);
  };

  const selectCondition = (index, condition) => {
    setShowConditionDropdownIndex(null);
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], condition, value: "" };
    setFilters(newFilters);
  };

  const updateValue = (index, value) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], value };
    setFilters(newFilters);
    applyFilters();
  };

  const removeFilter = (index) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    setFilters(newFilters);
    setShowConditionDropdownIndex(null);
  };

  return (
    <div className="space-y-4 m0 flex items-center gap-2.5" ref={dropdownRef}>
      {filters.map((filter, index) => (
        <div key={index} className="flex items-center space-x-2 m0">
          {/* <div className="font-semibold">{filter.attribute}</div> */}
          <div
            className="font-semibold cursor-pointer selected-key-menu"
            onClick={() => handleAttributeClick(index)}
          >
            {filter.attribute}
          </div>

          <div className="relative m0">
            <button
              onClick={() => setShowConditionDropdownIndex(index)}
              className="select-condition-btn"
            >
              {filter.condition || "Select condition"}
            </button>

            {showConditionDropdownIndex === index && (
              <div>
                <div className="absolute z-10 mt-2 bg-white border rounded shadow-lg py-1 filter-drop-down-conditions">
                  {attributeOptions[filter.attribute].map((condition) => (
                    <div>
                      <div
                        key={condition}
                        className="cursor-pointer filter-drop-down-conditions-menu"
                        onClick={() => selectCondition(index, condition)}
                      >
                        {condition}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {filter.condition && (
            <input
              type="text"
              value={filter.value}
              onChange={(e) => updateValue(index, e.target.value)}
              className="condition-input m0"
              placeholder="Enter value"
            />
          )}

          {/* {filters.map((filter, index) => (
        <div key={filter.attribute} className="flex items-center space-x-2">
          
          
        </div>
      ))} */}

          <div className="filter-item relative m0">
            <button
              onClick={() => handleToggleDropdown(index)}
              className="remove-filter-menu m0"
            >
              <BsThreeDotsVertical />
            </button>
            {activeDropdown === index && (
              <div className="dropdown-menu">
                <button
                  onClick={() => removeFilter(index)}
                  className="dropdown-item flex items-center"
                >
                  <RiDeleteBinLine />{" "}
                  <span className="ml-1.5">Delete condition</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
      <div className="relative m0">
        <button
          onClick={addFilter}
          className="bg-blue-500 text-white py-2 px-4 rounded-md filter-btn"
        >
          <VscFilter /> &nbsp; Filter
        </button>

        {showAttributeDropdown && (
          <div className="absolute z-10 mt-2 bg-white border rounded shadow-lg py-1 filter-drop-down">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search attributes"
              className="sort-search"
            />
            <div className="text-white company-attr-txt">
              Company attributes
            </div>
            {filteredAttributes.map((attribute) => (
              <div
                key={attribute}
                className="cursor-pointer sort-menu-item"
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
