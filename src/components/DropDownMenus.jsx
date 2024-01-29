import React, { useState, useRef } from 'react';
import useOutsideClick from '../hooks/useOutsideClick'; 
const Dropdown = ({ label, options, selected, onSelectedChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
  
    useOutsideClick(dropdownRef, () => {
      if (isOpen) setIsOpen(false);
    });
  
    return (
      <div ref={dropdownRef} className="dropdown">
        <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
          {label}
          <span className="dropdown-icon">▼</span>
        </div>
        {isOpen && (
          <div className="dropdown-list">
            {options.map((option, index) => (
              <div
                key={index}
                className={`dropdown-item ${selected === option ? 'selected' : ''}`}
                onClick={() => {
                  onSelectedChange(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  export default Dropdown;

  