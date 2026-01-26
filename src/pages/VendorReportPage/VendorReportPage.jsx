import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './VendorReportPage.css';
// Ensure fetchVendorList is exported from your service file
import { fetchVendorReportData, fetchVendorList } from '../../services/VendorService'; 

const VendorReportPage = () => {
  const location = useLocation();

  // --- STATE ---
  const [formData, setFormData] = useState({
    vendorName: '', // Start empty, will populate after fetch
    fromDate: '2018-02-09',
    toDate: '2018-07-08'
  });

  const [vendorOptions, setVendorOptions] = useState([]); // Stores the full list of vendors from API
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper to find the full vendor object based on the currently selected name
  const selectedVendorDetails = vendorOptions.find(v => v.vendorName === formData.vendorName) || {};

  // --- 1. FETCH VENDOR LIST ON MOUNT ---
  useEffect(() => {
    const loadVendors = async () => {
      try {
        const vendors = await fetchVendorList();
        setVendorOptions(vendors);
        
        // If we have vendors and no name is selected yet, select the first one by default
        if (vendors.length > 0 && !formData.vendorName) {
           setFormData(prev => ({ ...prev, vendorName: vendors[0].vendorName }));
        }
      } catch (err) {
        console.error("Failed to load vendor list:", err);
        setError("Could not load vendor list.");
      }
    };
    loadVendors();
  }, []);

  // --- 2. HANDLE REDIRECT FROM ENTRY PAGE ---
  useEffect(() => {
    if (location.state) {
      const { vendorName, fromDate, toDate } = location.state;
      console.log("Redirected with state:", location.state);

      setFormData({
        vendorName: vendorName || '',
        fromDate: fromDate || '',
        toDate: toDate || ''
      });

      if (vendorName && fromDate && toDate) {
        loadReportData(vendorName, fromDate, toDate);
      }
    }
  }, [location.state]);

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
      console.error(err);
      setError("Failed to fetch data from server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadReportData(formData.vendorName, formData.fromDate, formData.toDate);
  };

  return (
    <div className="report-container">
      
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
          {/* DYNAMIC DROPDOWN */}
          <select 
            name="vendorName" 
            className="form-control" 
            value={formData.vendorName}
            onChange={handleInputChange}
          >
            <option value="">-- Select Vendor --</option>
            {vendorOptions.map((vendor) => (
              <option key={vendor.vendorId} value={vendor.vendorName}>
                {vendor.vendorName}
              </option>
            ))}
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

      {error && <div className="error-msg">{error}</div>}

      {/* DYNAMIC VENDOR DETAILS */}
      <div className="vendor-details">
        <div className="detail-item">
          <strong>Address:</strong> {selectedVendorDetails.vendorAddress || "N/A"}
        </div>
        <div className="detail-item">
          <strong>Contact Number:</strong> {selectedVendorDetails.contactNumber || "N/A"}
        </div>
        <div className="detail-item">
          <strong>Contact person:</strong> {selectedVendorDetails.contactPerson || "N/A"}
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