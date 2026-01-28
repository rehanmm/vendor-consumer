import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="content-area">
        <h1 className="main-title">Problem Statement</h1>
        
        <div className="text-block">
          <p>
            <strong>ABC</strong>, a company needs a software to manage their inventory 
            purchased from vendors and maintains their payment due history. 
            The application helps to generate reports on:
          </p>
          <ul>
            <li>Vendor purchased items and balances.</li>
            <li>Material categories and unit tracking.</li>
            <li>Date-wise purchase history.</li>
          </ul>
        </div>

        {/* Add a button or link for further action */}
      </div>
    </div>
  );
};

export default HomePage;
