import React, { useState } from 'react';
import { MdKeyboardArrowDown, MdOutlineFileDownload } from 'react-icons/md';
import { GoCommentDiscussion } from 'react-icons/go';
import { IoSettingsOutline } from 'react-icons/io5';
import DropdownMenu from '../components/DropdownMenu';

const SubHeader = () => {
  const [showDropdown, setShowDropdown] = useState({
    first: false,
    second: false,
    third: false,
  });

  const toggleDropdown = key => {
    setShowDropdown(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      className="p-4 bg-white dark:bg-custom-gray shadow header-block flex relative"
      aria-label="Header"
    >
      <div
        onClick={() => toggleDropdown('first')}
        className="text-base text-gray-800 dark:text-white text-border pt-1 px-2.5 pb-1 flex items-center cursor-pointer"
      >
        All Companies <MdKeyboardArrowDown className="ml-2" />
        <DropdownMenu isVisible={showDropdown.first}>
          <div className="text-gray-800">Dropdown Content 1</div>
          <div className="text-gray-800">Dropdown Content 1</div>
        </DropdownMenu>
      </div>
      <div className="flex">
        <div className="text-white text-border pad4-10 ml-2.5 flex items-center comment-sec">
          <GoCommentDiscussion />
        </div>

        <div
          onClick={() => toggleDropdown('second')}
          className="text-base text-gray-800 dark:text-white pt-1 pb-1 flex items-center cursor-pointer"
        >
          <div className="text-white text-border flex  items-center pad4-10 ml-2.5">
            <IoSettingsOutline />
            <div className="pl-1.5">View Settings</div>
          </div>
          <DropdownMenu isVisible={showDropdown.second}>
            <div className="text-gray-800">Dropdown Content 1</div>
            <div className="text-gray-800">Dropdown Content 1</div>
          </DropdownMenu>
        </div>

        <div
          onClick={() => toggleDropdown('third')}
          className="text-base text-gray-800 dark:text-white pt-1 pb-1 flex items-center cursor-pointer"
        >
          <div className="text-white text-border flex items-center pad4-10 ml-2.5">
            <div>
              <MdOutlineFileDownload />
            </div>
            <div className="pl-1.5">Import / Export</div>
            <div>
              <MdKeyboardArrowDown className="ml-2" />
            </div>
          </div>
          <DropdownMenu isVisible={showDropdown.third}>
            <div className="text-gray-800">Dropdown Content 1</div>
            <div className="text-gray-800">Dropdown Content 1</div>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default SubHeader;
