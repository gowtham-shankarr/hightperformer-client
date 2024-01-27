import React, { useState, useRef } from 'react';
import { BsSortDownAlt } from "react-icons/bs";
import useOutsideClick from '../utils/useOutsideClick'
const SortMenu = () => {
  const [sorts, setSorts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const attributes = ['Domains', 'Name', 'Description'];
  const dropdownRef = useRef(null);
  const handleAttributeSelect = (index, attribute) => {
    if (index !== undefined) {
      setSorts(sorts.map((sort, i) => (i === index ? { ...sort, attribute } : sort)));
    } else {
      setSorts([...sorts, { attribute, direction: 'Ascending' }]);
    }
    setShowDropdown(false);
  };

  useOutsideClick(dropdownRef, () => {
    if (showDropdown) {
      setShowDropdown(false);
    }
  });

  const updateSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredAttributes = attributes.filter(attr =>
    attr.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDirectionChange = (index, direction) => {
    setSorts(sorts.map((sort, i) => (i === index ? { ...sort, direction } : sort)));
  };

  const handleAddSortClick = () => {
    setShowDropdown(true);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button onClick={handleAddSortClick} className="bg-gray-800 text-white px-4 py-2 rounded-md sort-btn">
      <BsSortDownAlt /> &nbsp;
        {sorts.length > 0 ? `Sorted by + ${sorts.length}` : 'Sort'}
      </button>
      {showDropdown && (
         <div className="absolute z-10 mt-2 sort-menu-block">
         <div>
           <input
             type="text"
             placeholder="Search attributes"
             value={searchTerm}
             onChange={updateSearch}
             className="p-2 w-full rounded-md sort-search"
           />
         </div>
         <div className='text-white company-attr-txt'>
          Company attributes
          </div>
         {sorts.length === 0 ? (
           filteredAttributes.map((attribute) => (
             <div key={attribute} className="cursor-pointer sort-menu-item" onClick={() => handleAttributeSelect(undefined, attribute)}>
               {attribute}
             </div>
           ))
         ) : (
            sorts.map((sort, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex justify-between items-center px-4 py-2">
                  <select
                    className="bg-transparent rounded-md"
                    value={sort.attribute}
                    onChange={(e) => handleAttributeSelect(index, e.target.value)}
                  >
                    {attributes.map(attr => (
                      <option key={attr} value={attr}>{attr}</option>
                    ))}
                  </select>
                  <select
                    className="bg-transparent rounded-md"
                    value={sort.direction}
                    onChange={(e) => handleDirectionChange(index, e.target.value)}
                  >
                    <option value="Ascending">Ascending</option>
                    <option value="Descending">Descending</option>
                  </select>
                </div>
                {index === sorts.length - 1 && (
                  <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleAttributeSelect(undefined)}>
                    + Add sort
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SortMenu;
