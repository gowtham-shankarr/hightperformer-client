import React, { useState, useRef, useEffect } from 'react';
import { BsSortDownAlt } from 'react-icons/bs';
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
  const sortMenuRef = useRef(null);
  const [openDropdown, setOpenDropdown] = useState({ index: null, type: null });
    

  useOutsideClick(dropdownRef, () => setShowDropdown(false));

  const updateSearch = (e) => setSearchTerm(e.target.value);

  const filteredAttributes = attributes.filter(attr =>
    attr.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown({ index: null, type: null });
      }
    }
    if (openDropdown.index !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const [firstClick, setFirstClick] = useState(true);

  const handleAddSortClick = () => {
    if (firstClick) {
      setFirstClick(false);
      setSorts([...sorts, { attribute: '', direction: 'Ascending' }]);
    } else {
      setShowDropdown(!showDropdown);
    }
  };

  const applySort = () => {
    const sortParams = sorts.map(sort => ({
      field: sort.attribute,
      order: sort.direction === 'Ascending' ? 'ASC' : 'DESC'
    }));
    onSortChange(sortParams);
  };

  const handleAttributeSelect = (index, attribute) => {
    let updatedSorts;
  
    if (typeof index === 'undefined') {
      updatedSorts = [...sorts, { attribute, direction: 'Ascending' }];
      setOpenDropdown({ index: updatedSorts.length - 1, type: 'direction' });
    } else {
      updatedSorts = sorts.map((sort, i) => 
        i === index ? { ...sort, attribute } : sort
      );
      setOpenDropdown({ index, type: 'direction' });
    }
  
    setSorts(updatedSorts);
    applySort(updatedSorts);
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
        <div className="absolute z-10 mt-2">
          <div className="width280">
          {sorts.length === 0 && (
            <>
              <input
                type="text"
                placeholder="Search attributes..."
                value={searchTerm}
                onChange={updateSearch}
                className="p-2 w-full rounded-md sort-search"
              />
              <div className='text-white company-attr-txt'>
                Company attributes
              </div>
              {filteredAttributes.map((attribute, attrIndex) => (
              <div key={attribute} className="cursor-pointer sort-menu-item" onClick={() => handleAddSort()}>
                {attribute}
              </div>
            ))}
            </>
          )}
          </div>
          {sorts.length > 0 && (
          <div className="width480">
          {sorts.map((sort, index) => (
            <div key={index} className="flex flex-col relative">
              <div className="flex justify-between items-center px-4 py-1">
                <div className="flex items-center">
                  <div
                    className="menu-sort-inner cursor-pointer menu-attri"
                    onClick={() => setOpenDropdown({ index, type: 'attribute' })}
                  >
                    <div className="flex items-center justify-between">
                      <div>{sort.attribute || 'Select attribute'}</div>
                    <div className="text-grey-txt3">
                        <FaChevronDown />
                      </div>
                    </div>
                    
                  </div>
                  <div
                    className="menu-sort-inner cursor-pointer direction-sort"
                    onClick={() => setOpenDropdown({ index, type: 'direction' })}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <BsSortUp />
                        <span className="pl-1.5">{sort.direction}</span>
                      </div>
                      <div className="text-grey-txt3">
                        <FaChevronDown />
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleRemoveSort(index)} className="text-grey-txt3 close-sort"><RiCloseFill /></button>
                </div>
              </div>
              {openDropdown.index === index && openDropdown.type === 'attribute' && (
                <div className="dropdown-content sort-menu-block" ref={sortMenuRef}>
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
                <div className="dropdown-content sort-direction-content sort-menu-block" ref={sortMenuRef}>
                  {['Ascending', 'Descending'].map(direction => (
                    <div
                      key={direction}
                      className="dropdown-item cursor-pointer sort-menu-item w-full"
                      onClick={() => handleDirectionChange(index, direction)}
                    >
                      {direction}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {sorts.length > 0 && (
            <div className="px-4 py-2 add-sort-btn cursor-pointer" onClick={handleAddSort}>
              + Add sort
            </div>
          )}
          </div>
          )}

        </div>
      )}
    </div>
  );
  
};

export default SortMenu;
