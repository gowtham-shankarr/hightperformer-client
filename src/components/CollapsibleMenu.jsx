import React, { useState } from 'react';
import { RiArrowDropRightLine, RiArrowDropDownLine } from "react-icons/ri";

const CollapsibleMenu = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-2 ml-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-white text-left focus:outline-none menu-bar-hover mb-2.5"
      >
        <span className="text-2xl icon-color-menu">
          {isOpen ? <RiArrowDropDownLine /> : <RiArrowDropRightLine />}
        </span>
        <span className="flex-1 label-menu-name">{title}</span>
      </button>
      <div className={`transition duration-300 ease-in-out ${isOpen ? 'block' : 'hidden'}`}>
        {children}
      </div>
    </div>
  );
};

export default CollapsibleMenu;





