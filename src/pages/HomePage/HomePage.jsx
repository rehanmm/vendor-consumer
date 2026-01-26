import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Inventory Management System</h1>
        <p className="subtitle">Select a module to continue</p>
      </header>

      <div className="card-grid">
        {/* Card 1: Material Entry */}
        <Link to="/materialPage" className="nav-card">
          <div className="icon-wrapper">
            <span role="img" aria-label="entry">📝</span>
          </div>
          <h2>Material Entry</h2>
          <p>Record new purchase entries, select vendors, and generate purchase IDs.</p>
          <div className="btn-fake">Go to Entry</div>
        </Link>

        {/* Card 2: Vendor Report */}
        <Link to="/vendorReport" className="nav-card">
          <div className="icon-wrapper">
            <span role="img" aria-label="report">📊</span>
          </div>
          <h2>Vendor Report</h2>
          <p>View detailed purchase history, filter by dates, and analyze costs.</p>
          <div className="btn-fake">View Reports</div>
        </Link>
      </div>

      <footer className="home-footer">
        &copy; 2024 Inventory System
      </footer>
    </div>
  );
};

export default HomePage;