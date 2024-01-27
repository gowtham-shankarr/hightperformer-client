import React from 'react';
import { IoMdInformationCircleOutline } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";

const Header = () => {
  return (
    <header className="p-4 bg-white dark:bg-custom-gray shadow header-block" aria-label="Header">
      <div className='flex justify-between items-center w-full	'>
      <div className="flex items-center space-between">
      <h1 className="text-base text-gray-800 dark:text-white">Companies</h1>
      <div className='pl-1.5 text-grey-txt'>
      <IoMdInformationCircleOutline />
      </div>
      </div>

      <div className="flex items-center p-2">
      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-500 text-white text-xs	">
        G
      </div>
      <div className="text-grey-txt2 ml-2 text-xs	">
      <BsThreeDotsVertical />
      </div>
      </div>
      </div>
     
    </header>
  );
};

export default Header;
