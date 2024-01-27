// MainContent.js
import React from 'react';

const MainContent = ({ children }) => {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="w-full">
        <div className="bg-white dark:bg-custom-gray shadow h-screen">
          {children}
        </div>
      </div>
    </main>
  );
};

export default MainContent;
