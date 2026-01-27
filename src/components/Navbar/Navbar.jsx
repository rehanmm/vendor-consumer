import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {


  return (
    <nav className="navbar">
      <ul className="nav-menu">
        
        {/* HOME TAB */}
        <li className="nav-item">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          {/* Tooltip is always here, hidden by CSS until hover */}
          <div className="tooltip">View Dashboard & Problem Statement</div>
        </li>

        {/* ENTRY TAB */}
        <li className="nav-item">
          <NavLink to="/materialPage" className="nav-link">
            Entry
          </NavLink>
          <div className="tooltip">Record new material purchases</div>
        </li>

        {/* REPORT TAB */}
        <li 
          className="nav-item dropdown-container"
        >
          <span className="nav-link non-clickable">
            Report
          </span>
          
          {/* Tooltip always renders now */}
          <div className="tooltip">View Vendor Analytics</div>

        </li>

      </ul>
    </nav>
  );
};

export default Navbar;