import React from 'react';
import './App.css';
// Ensure this path matches where your files are actually located
import { MaterialEntryPage, VendorReportPage } from './pages'; 
// 1. Import BrowserRouter
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import Navbar from './components/Navbar/Navbar';


function App() {
  return (
    // 2. Wrap the entire application (or at least the Routes) in <Router>
    <Router>
      <div className="App"> 
      <Navbar/>
        <Routes>
          <Route path="/materialPage" element={<MaterialEntryPage />} />
          <Route path="/vendorReport" element={<VendorReportPage />} />
          
          {/* Default path redirects to Material Entry */}
          <Route path="/" element={<HomePage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;