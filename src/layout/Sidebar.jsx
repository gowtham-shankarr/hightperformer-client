import React, {useState} from 'react';
import { FiSearch } from 'react-icons/fi';
import KIcon from '../img/Kicon';
import { GoSidebarCollapse } from "react-icons/go";
import { FiBell } from "react-icons/fi";
import { RiTaskLine } from "react-icons/ri";
import { FaRegNoteSticky } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { LuWorkflow } from "react-icons/lu";
import CollapsibleMenu from '../components/CollapsibleMenu';
import MenuItem from '../components/MenuItem';
import { IoIosHelpCircleOutline } from "react-icons/io";
import { RxAvatar } from "react-icons/rx";
import { MdPeopleAlt } from "react-icons/md";
import { FaFileInvoice } from "react-icons/fa";
import { MdKeyboardArrowDown } from 'react-icons/md';

const NavItem = ({ icon: Icon, label, active }) => {
  return (
    <div className={`flex items-center mx-1.5 px-2.5 py-2 rounded-md`}>
      <Icon className="w-3.5 h-3.5 text-white-500 mr-1.5" />
      <span className="text-white text-sm">{label}</span>
    </div>
  );
};

const Sidebar = ({ toggleTheme }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    console.log('clicked')
  };
  return (
    <aside className={`sidebar-width bg-sidebar-dark ${isCollapsed ? 'collapsed' : 'expanded'}`} aria-label="Sidebar">
      <div className="relative h-full">
      <div>
        <div className='flex justify-between items-center relative'> 
        <div className='menubar-hide sidebar-header'>
        <div className="flex items-center text-white">
          <div className="brand-icon">H</div>
          <div className='flex items-center'>Highapps <MdKeyboardArrowDown className="ml-2" /></div>
        </div>
        </div>
        <div>
        <GoSidebarCollapse className='text-lg absolute right-5 top-4 text-grey-txt3 cursor-pointer right-5px' onClick={toggleSidebar}/>
        </div>
        </div>

        <div className="sidebar-content">
          <div className='menubar-hide'>
          <div className="text-white rounded flex items-center space-x-4">
            <button className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 focus:outline-none quick-action justify-between">
            <div className="items-center	flex">
            <div className="keyboard-icon-svg">
            <KIcon/>
            </div>
            <div className="quick-action-text ml-2">Quick actions</div>
            </div>
              <div className="quick-action-icon">
                <kbd>
                <span className="text-xs" style={{ fontSize: '10px' }}>⌘</span>k
                </kbd>
              </div>
            </button>
            <button className="p-2 rounded hover:bg-gray-700 focus:outline-none quick-search">
              <FiSearch className="text-sm" />
              <kbd className='quick-action-icon2'>/</kbd>
            </button>
          </div>
          </div>
        </div>
        <div>
        <div className=''>
          <nav className="text-white">
            <NavItem icon={FiBell} label="Notifications" />
            <NavItem icon={RiTaskLine} label="Tasks" />
            <NavItem icon={FaRegNoteSticky} label="Notes" />
            <NavItem icon={MdOutlineEmail} label="Emails" />
            <NavItem icon={HiOutlineDocumentReport} label="Reports" />
            <NavItem icon={LuWorkflow} label="Automations" />
    </nav>
          </div>
        </div>

        <div className='mt-4 menubar-hide'>
        <div className="text-white">
      <CollapsibleMenu title="Records">
        <MenuItem label="Companies" active Icon={MdPeopleAlt}/>
        <MenuItem label="People"  Icon={FaFileInvoice}/>
      </CollapsibleMenu>
      <CollapsibleMenu title="Lists">
        <MenuItem label="🌍&nbsp;&nbsp;Outsourcing" />
        <MenuItem label="🔎&nbsp;&nbsp;Recruiting" />
        <MenuItem label="👩‍💻&nbsp;&nbsp;Employee Onboarding" />
      </CollapsibleMenu>
    </div>
        </div>
        </div>

        <div>
        <div className="move-to-bottom">
          <nav className="text-white">
            <NavItem icon={RxAvatar} label="Invite teammates" />
            <NavItem icon={IoIosHelpCircleOutline} label="Help and first steps" />
    </nav>
          </div>
        </div>

        {/* <label
          htmlFor="theme-switch"
          className="flex items-center cursor-pointer"
        >
          <div className="relative">
            <input
              id="theme-switch"
              type="checkbox"
              className="sr-only peer"
              onChange={toggleTheme}
            />
            <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
            <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition peer-checked:translate-x-6"></div>
          </div>
          <div className="ml-3 text-gray-700 dark:text-gray-300 font-medium">
            Toggle Dark Mode
          </div>
        </label> */}
      </div>
    </aside>
  );
};
export default Sidebar;
