import React from 'react';

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Student Portal</h2>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <a href="#" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
              <i className="ri-dashboard-line"></i>
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
              <i className="ri-file-list-line"></i>
              <span>My Exams</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
              <i className="ri-bar-chart-line"></i>
              <span>Results</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
              <i className="ri-user-settings-line"></i>
              <span>Profile</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;