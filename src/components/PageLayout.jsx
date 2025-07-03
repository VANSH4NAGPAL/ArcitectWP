import React, { useRef } from 'react';
import LeftSidebar from './LeftSidebar';
import { Outlet } from 'react-router-dom';

const PageLayout = () => {
  const sidebarRef = useRef(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row overflow-hidden">
      <LeftSidebar ref={sidebarRef} />
      <div className="w-full lg:w-[80%] flex flex-col lg:h-screen overflow-x-hidden">
        <div className="h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
