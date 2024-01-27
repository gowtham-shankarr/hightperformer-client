import React from 'react';

const DropdownMenu = ({ children, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute bg-white shadow-lg mt-2 rounded p-2 z-10 dp-menu-position">
      {children}
    </div>
  );
};

export default DropdownMenu;
