import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MaterialsEntryPage.css'; 
import { fetchAllMaterialFormData, savePurchaseEntry } from '../../services/MaterialService';


const MaterialsEntryPage = () => {
  const navigate = useNavigate();

  // --- State for Form Fields ---
  const [formData, setFormData] = useState({
    vendorName: '',
    materialCategoryId: '', // These IDs will now be populated automatically
    materialTypeId: '',
    brandName: '',
    unitId: '',
    quantity: '',
    purchaseAmount: '',
    purchaseDate: '',
    materialCategoryName: '',
    materialTypeName: '',
    MaterialUnitName: '', // Note: Keeping casing as per your request
    balance: 0.0,         // Added balance (often required by backend)
    status: 'Pending'     // Added status (optional)
  });

  const [generatedId, setGeneratedId] = useState('');
  const [vendorOptions, setVendorOptions] = useState([]);
  const [materialData, setMaterialData] = useState({
    categories: [],
    types: [],
    units: []
  });

  const [error, setError] = useState(null);

  // --- EFFECT: Fetch Data ---
  useEffect(() => {
    const loadData = async () => {
      setError(null);
        try {
          const data = await fetchAllMaterialFormData();
          // FIX: Removed direct state mutation (formData.unitId = ...). 
          // We only set the dropdown options here. The IDs are set when user selects an option.
          setVendorOptions(data.vendors);
          setMaterialData({ categories: data.categories, types: data.types, units: data.units });
        } catch (err) {
          setError("API Connection Failed.",err);
        }
      
    };
    loadData();
  }, []);

  // --- FIX: Smart Handle Change ---
  // This function now updates the Name AND finds the matching ID
  const handleChange = (e) => {
    const { name, value } = e.target;
    let extraUpdates = {};

    // 1. If Category Name changes, find and set Category ID
    if (name === 'materialCategoryName') {
        const selectedCat = materialData.categories.find(c => c.categoryName === value);
        extraUpdates.materialCategoryId = selectedCat ? selectedCat.categoryId : '';
    }

    // 2. If Type Name changes, find and set Type ID
    if (name === 'materialTypeName') {
        const selectedType = materialData.types.find(t => t.typeName === value);
        extraUpdates.materialTypeId = selectedType ? selectedType.typeId : '';
    }

    // 3. If Unit Name changes, find and set Unit ID
    if (name === 'MaterialUnitName') {
        const selectedUnit = materialData.units.find(u => u.unitName === value);
        extraUpdates.unitId = selectedUnit ? selectedUnit.unitId : '';
    }

    // Update state with Name AND the found ID
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...extraUpdates
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    
    // FIX: Clean up payload creation
    const payload = { 
        ...formData, 
        balance: formData.purchaseAmount // Assuming balance = purchaseAmount initially
    };
    
    console.log("Submitting Payload:", payload);
    
    // FIX: Proper Promise chain
    savePurchaseEntry(payload)
      .then((response) => {
        console.log("Server Response:", response);
        response=JSON.parse(response);
        alert(`Success! Entry saved with ID: ${response.transactionId}`);
        setGeneratedId(response.transactionId);
        
        // FIX: Only navigate if API call is successful
        navigate('/vendorReport', { 
            state: { 
              vendorName: formData.vendorName,
              fromDate: formData.purchaseDate,
              toDate: formData.purchaseDate 
            } 
        });
      })
      .catch((err) => {
        console.error("Save Error:", err);
        alert("Failed to save data. Please check console.");
      });
  };

  return (
    <div className="container">
      <div className="form-wrapper">
        <div className="header">
          <h2>Materials Purchased Entry</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Vendor Name */}
          <div className="form-group">
            <label>Vendor Name</label>
            <select name="vendorName" value={formData.vendorName} onChange={handleChange} required>
              <option value="">-- Select Vendor --</option>
              {vendorOptions.map((v) => (
                <option key={v.vendorId} value={v.vendorName}>{v.vendorName}</option>
              ))}
            </select>
          </div>

          {/* Material Category */}
          <div className="form-group">
            <label>Material Category</label>
            {/* FIX: name must match state key 'materialCategoryName' */}
            <select name="materialCategoryName" value={formData.materialCategoryName} onChange={handleChange} required>
              <option value="">-- Select Category --</option>
              {materialData.categories.map((c) => (
                <option key={c.categoryId} value={c.categoryName}>{c.categoryName}</option>
              ))}
            </select>
          </div>

          {/* Material Type */}
          <div className="form-group">
            <label>Material Type</label>
            <select name="materialTypeName" value={formData.materialTypeName} onChange={handleChange}>
              <option value="">-- Select Type --</option>
              {materialData.types.map((t) => (
                <option key={t.typeId} value={t.typeName}>{t.typeName}</option>
              ))}
            </select>
          </div>

          {/* Unit */}
          <div className="form-group">
            <label>Unit</label>
            <select name="MaterialUnitName" value={formData.MaterialUnitName} onChange={handleChange}>
              <option value="">-- Select Unit --</option>
              {materialData.units.map((u) => (
                <option key={u.unitId} value={u.unitName}>{u.unitName}</option>
              ))}
            </select>
          </div>

          {/* Brand Name */}
          <div className="form-group">
            <label>Brand Name</label>
            <input type="text" name="brandName" value={formData.brandName} onChange={handleChange} placeholder="e.g. Raymonds"/>
          </div>

          {/* Quantity */}
          <div className="form-group">
            <label>Quantity</label>
            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
          </div>

          {/* Purchase Amount */}
          <div className="form-group">
            <label>Purchase Amount</label>
            <input type="number" name="purchaseAmount" value={formData.purchaseAmount} onChange={handleChange} />
          </div>

          {/* Purchase Date */}
          <div className="form-group">
            <label>Purchase Date</label>
            <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} required />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">Submit & View Report</button>
          </div>
        </form>

        <div className="footer-note">
           <p>Note: <i>Purchase Id is generated on submit</i></p>
        </div>
      </div>
    </div>
  );
};

export default MaterialsEntryPage;