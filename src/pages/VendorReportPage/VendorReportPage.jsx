import React, { useState } from 'react';
import './VendorReportPage.css';
import DummyVendorPage from '../../dummyData/VendorPageDummy';
// Import the separated service logic
import { fetchVendorReportData } from '../../services/VendorService'; 

const VendorReportPage = () => {
  // --- STATE ---
  const [formData, setFormData] = useState({
    vendorName: 'XYZ Enterprises',
    fromDate: '2018-02-09',
    toDate: '2018-07-08'
  });

  const [reportData, setReportData] = useState(DummyVendorPage);
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

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Calling the separated API service
      const data = await fetchVendorReportData(
        formData.vendorName, 
        formData.fromDate, 
        formData.toDate
      );
      
      // Handle empty vs populated data
      if (data && data.length > 0) {
        setReportData(data);
      } else {
        setReportData([]); // Show empty table
      }

    } catch (err) {
      // Error handling logic remains in UI to show feedback to user
      setError("Failed to fetch data from server. Displaying Dummy Data.");
      setReportData(DummyVendorPage); 
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* STATIC VENDOR INFO */}
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