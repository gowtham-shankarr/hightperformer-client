import React, { useState, useRef } from 'react';
import { BsSortDownAlt } from 'react-icons/bs';
import { PiDotsSix } from 'react-icons/pi';
import useOutsideClick from '../utils/useOutsideClick';
import { RiCloseFill } from "react-icons/ri";
import { FaChevronDown } from "react-icons/fa";
import { BsSortUp } from "react-icons/bs";

const SortMenu = ({ onSortChange }) => {
  const [sorts, setSorts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const attributes = ['company name', 'domains', 'linkedin', 'twitter', 'categories', 'twitter follower', 'description'];
  const dropdownRef = useRef(null);
  const [openDropdown, setOpenDropdown] = useState({ index: null, type: null });

  useOutsideClick(dropdownRef, () => setShowDropdown(false));

  const updateSearch = (e) => setSearchTerm(e.target.value);

  const filteredAttributes = attributes.filter(attr =>
    attr.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const applySort = () => {
    const sortParams = sorts.map(sort => ({
      field: sort.attribute,
      order: sort.direction === 'Ascending' ? 'ASC' : 'DESC'
    }));
    onSortChange(sortParams);
  };

  const handleAttributeSelect = (index, attribute) => {
    const updatedSorts = sorts.map((sort, i) => 
      i === index ? { ...sort, attribute } : sort
    );
    setSorts(updatedSorts);
    applySort();
  };

  const handleDirectionChange = (index, direction) => {
    const updatedSorts = sorts.map((sort, i) => 
      i === index ? { ...sort, direction } : sort
    );
    setSorts(updatedSorts);
    applySort();
  };

  const handleAddSort = () => {
    setSorts([...sorts, { attribute: '', direction: 'Ascending' }]);
  };

  const handleRemoveSort = (index) => {
    const newSorts = sorts.filter((_, i) => i !== index);
    setSorts(newSorts);
    applySort();
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>


      <button onClick={() => setShowDropdown(!showDropdown)} className="bg-gray-800 text-white px-4 py-2 rounded-md sort-btn">
        <BsSortDownAlt /> &nbsp; {sorts.length > 0 ? `Sorted by + ${sorts.length}` : 'Sort'}
      </button>

      {showDropdown && (
        <div className="absolute z-10 mt-2 sort-menu-block attri-sort-menu-block">
          {sorts.map((sort, index) => (
            <div key={index} className="flex flex-col relative">
              <div className="flex justify-between items-center px-4 py-1">
                <div className="flex items-center">
                  {/* <PiDotsSix /> */}
                  <div
                    className="menu-sort-inner cursor-pointer menu-attri"
                    onClick={() => setOpenDropdown({ index, type: 'attribute' })}
                  >
                    {sort.attribute || 'Select attribute'}
                  </div>
                </div>
                <div
                  className="menu-sort-inner cursor-pointer direction-sort"
                  onClick={() => setOpenDropdown({ index, type: 'direction' })}
                >
                  <div className="flex items-center justify-between">
                  <div className="flex items-center">
                  <BsSortUp />
                    {sort.direction}
                  </div>
                    <div className="text-grey-txt3">
                    <FaChevronDown />
                      </div>
                    
                  </div>
                  
                </div>
                <button onClick={() => handleRemoveSort(index)} className="text-grey-txt3"><RiCloseFill /></button>
              </div>

              {openDropdown.index === index && openDropdown.type === 'attribute' && (
                <div className="dropdown-content sort-menu-block">
                  {filteredAttributes.map(attr => (
                    <div
                      key={attr}
                      className="dropdown-item sort-menu-item"
                      onClick={() => handleAttributeSelect(index, attr)}
                    >
                      {attr}
                    </div>
                  ))}
                </div>
              )}

              {openDropdown.index === index && openDropdown.type === 'direction' && (
                <div className="dropdown-content sort-direction-content sort-menu-block">
                  {['Ascending', 'Descending'].map(direction => (
                    <div className="flex items-center">
                      
                       <div
                      key={direction}
                      className="dropdown-item cursor-pointer sort-menu-item w-full"
                      onClick={() => handleDirectionChange(index, direction)}
                    >
                      {direction} 
                    </div>

                    </div>
                   
                  ))}
                </div>
              )}
            </div>
          ))}

          <button className="px-4 py-2 add-sort-btn cursor-pointer" onClick={handleAddSort}>
            + Add sort
          </button>
        </div>
      )}
    </div>
  );
};

export default SortMenu;
