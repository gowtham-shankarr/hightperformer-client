import React from 'react';

const MenuItem = ({ label, active, Icon }) => {
  return (
    <div className={`flex items-center text-white text-sm py-2 px-2.5 menu-item rounded-md mr-2.5 ${active ? 'bg-menu-bg' : 'bg-transparent'}`}>
      {Icon && <div className="bg-blue"><Icon className="mr-2 h-3 w-3 menu-svg-icon" /></div>} 
      {label}
    </div>
  );
};

export default MenuItem;
