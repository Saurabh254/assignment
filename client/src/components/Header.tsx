import React from 'react';

const Header = () => {
  return (
    <header className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">Welcome, Student</h1>
      <button className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
        <i className="ri-logout-box-line"></i>
        <span>Logout</span>
      </button>
    </header>
  );
};

export default Header;