import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // <--- 1. Import useLocation
import './VendorReportPage.css';
import { fetchVendorReportData } from '../../services/VendorService'; 

const VendorReportPage = () => {
  const location = useLocation(); // <--- 2. Initialize location hook

  // --- STATE ---
  const [formData, setFormData] = useState({
    vendorName: 'XYZ Enterprises',
    fromDate: '2018-02-09',
    toDate: '2018-07-08'
  });

  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatDateForDisplay = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-GB').replace(/\//g, '-');
  };

  // --- REUSABLE FETCH LOGIC ---
  // Extracted this so we can call it from Button Click AND from useEffect
  const loadReportData = async (vName, fDate, tDate) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchVendorReportData(vName, fDate, tDate);
      
      if (data && data.length > 0) {
        setReportData(data);
      } else {
        setReportData([]); 
      }
    } catch (err) {
      setError("Failed to fetch data from server.",err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- EVENT: Manual Form Submit ---
  const handleSearch = (e) => {
    e.preventDefault();
    loadReportData(formData.vendorName, formData.fromDate, formData.toDate);
  };

  // --- EVENT: On Page Load (Check for redirected data) ---
  useEffect(() => {
    // If data was passed via navigate(), use it!
    if (location.state) {
      const { vendorName, fromDate, toDate } = location.state;

      console.log("Redirected with state:", location.state);

      // 1. Update the Filter Form UI
      setFormData({
        vendorName: vendorName || '',
        fromDate: fromDate || '',
        toDate: toDate || ''
      });

      // 2. Trigger API Call automatically
      // We pass values directly because setFormData is async and might not be done yet
      if (vendorName && fromDate && toDate) {
        loadReportData(vendorName, fromDate, toDate);
      }
    }
  }, [location.state]); // Only run if location state changes

  return (
    <div className="report-container">
      
      {/* HEADER */}
      <div className="page-header">
        <h2 className="page-title">Vendor purchase report</h2>
        <p className="description-text">
          This screen displays a report on materials purchased from a vendor. Additionally, the user may filter the report by specifying 'From' and 'To' dates.
        </p>
      </div>

      {/* FILTER FORM */}
      <form className="filter-section" onSubmit={handleSearch}>
        <div className="filter-header">Vendor Purchase Report</div>
        
        <div className="form-group">
          <label>Vendor Name</label>
          <select 
            name="vendorName" 
            className="form-control" 
            value={formData.vendorName}
            onChange={handleInputChange}
          >
            <option value="XYZ Enterprises">XYZ Enterprises</option>
            <option value="Only Vimal">Only Vimal</option>
            <option value="Brand A">Brand A</option>
          </select>
        </div>

        <div className="form-group">
          <label>From date</label>
          <input 
            type="date" 
            name="fromDate" 
            className="form-control"
            value={formData.fromDate}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>To date</label>
          <input 
            type="date" 
            name="toDate" 
            className="form-control"
            value={formData.toDate}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" className="btn-search" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Search'}
        </button>
      </form>

      {/* ERROR MESSAGE */}
      {error && <div className="error-msg">{error}</div>}

      {/* VENDOR DETAILS */}
      <div className="vendor-details">
        <div className="detail-item">
          <strong>Address:</strong> Stock home road, Sector 22, New Delhi, 110001
        </div>
        <div className="detail-item">
          <strong>Contact Number:</strong> 9005600744
        </div>
        <div className="detail-item">
          <strong>Contact person:</strong> Elizabeth
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="table-wrapper">
        <table className="report-table">
          <thead>
            <tr>
              <th>Material Category</th>
              <th>Material Type</th>
              <th>Brand</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Price</th>
              <th>Balance</th>
              <th>Purchase Date</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((row, index) => (
              <tr key={row.purchaseId || index}>
                <td className="category-col">
                  {row.materialCategoryName || row.materialCategoryId || "N/A"}
                </td>
                <td>{row.materialTypeName || row.materialTypeId || "N/A"}</td>
                <td>{row.brandName || "N/A"}</td>
                <td>{row.quantity}</td>
                <td>{row.materialUnitName || row.unitId || "N/A"}</td>
                <td>{parseFloat(row.purchaseAmount).toFixed(2)}</td>
                <td>
                    {row.balance !== null 
                        ? parseFloat(row.balance).toFixed(2) 
                        : "0.00"}
                </td>
                <td>{formatDateForDisplay(row.purchaseDate)}</td>
              </tr>
            ))}
            
            {reportData.length === 0 && (
              <tr>
                <td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="footer">
        Copyright © 2024 Accenture. All rights reserved.
      </div>

    </div>
  );
};

export default VendorReportPage;    