import React, { useState, useEffect } from 'react';
import './MaterialsEntryPage.css'; 
import { dummyCategories, dummyTypes, dummyVendors, dummyUnits } from '../../dummyData/MaterialPageDummy';
// Import the service
import { fetchAllMaterialFormData } from '../../services/MaterialService';

// ==========================================
// 1. CONFIGURATION: TOGGLE DATA SOURCE HERE
// ==========================================
const USE_DUMMY_DATA = true; // Set to FALSE to use real API calls
// ==========================================

const MaterialsEntryPage = () => {
  // --- State for Form Fields ---
  const [formData, setFormData] = useState({
    vendorName: '',
    materialCategory: '',
    materialType: '',
    unit: '',
    brandName: '',
    quantity: '',
    purchaseAmount: '',
    purchaseDate: ''
  });

  const [generatedId, setGeneratedId] = useState('');

  // --- State for Data (Dropdowns) ---
  const [vendorOptions, setVendorOptions] = useState([]);
  const [materialData, setMaterialData] = useState({
    categories: [],
    types: [],
    units: []
  });

  const [error, setError] = useState(null);

  // --- EFFECT: Fetch Data (Dummy or Real) ---
  useEffect(() => {
    const loadData = async () => {
      setError(null);

      if (USE_DUMMY_DATA) {
        console.log("Loading Dummy Data...");
        setVendorOptions(dummyVendors);
        setMaterialData({
          categories: dummyCategories,
          types: dummyTypes,
          units: dummyUnits
        });
      } else {
        console.log("Attempting API Calls...");
        try {
          // Use the service to fetch everything in parallel
          const data = await fetchAllMaterialFormData();
          
          setVendorOptions(data.vendors);
          setMaterialData({
            categories: data.categories,
            types: data.types,
            units: data.units
          });
        } catch (err) {
          setError("API Connection Failed. Using Dummy Data as fallback.");
          // Fallback mechanism (optional)
          setVendorOptions(dummyVendors);
          setMaterialData({
             categories: dummyCategories,
             types: dummyTypes,
             units: dummyUnits
          });
        }
      }
    };

    loadData();
  }, []);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const generatePurchaseId = () => {
    // Logic: P_{VendorId}_{Date}_{CategoryId}_1
    
    // 1. Get Vendor ID safely
    const selectedVendor = vendorOptions.find(v => v.vendorName === formData.vendorName);
    const vCode = selectedVendor ? selectedVendor.vendorId : 'UNK';

    // 2. Format Date
    let dateStr = '00000000';
    if(formData.purchaseDate) {
      const [year, month, day] = formData.purchaseDate.split('-');
      dateStr = `${month}${day}${year}`; 
    }

    // 3. Get Category ID safely
    const selectedCat = materialData.categories.find(c => c.categoryName === formData.materialCategory);
    const cCode = selectedCat ? selectedCat.categoryId : 'XXX';

    return `P_${vCode}_${dateStr}_${cCode}_1`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = generatePurchaseId();
    setGeneratedId(newId);
    
    // Create the final payload object
    const payload = { ...formData, purchaseId: newId };
    
    console.log("Submitting Payload:", payload);
    alert(`Form Submitted!\nGenerated Purchase ID: ${newId}`);
    
    // Here you would typically call another service function to POST the data:
    // await saveMaterialEntry(payload);
  };

  return (
    <div className="container">
      <div className="form-wrapper">
        <div className="header">
          <h2>Materials Purchased Entry</h2>
          {USE_DUMMY_DATA && <span style={{fontSize:'12px', color:'red'}}>(Dev Mode: Dummy Data)</span>}
          {error && <span style={{fontSize:'12px', color:'orange', display:'block'}}>{error}</span>}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Vendor Name */}
          <div className="form-group">
            <label>Vendor Name</label>
            <select 
              name="vendorName" 
              value={formData.vendorName} 
              onChange={handleChange}
              required
            >
              <option value="">-- Select Vendor --</option>
              {vendorOptions.map((v) => (
                <option key={v.vendorId} value={v.vendorName}>{v.vendorName}</option>
              ))}
            </select>
          </div>

          {/* Material Category */}
          <div className="form-group">
            <label>Material Category</label>
            <select 
              name="materialCategory" 
              value={formData.materialCategory} 
              onChange={handleChange}
              required
            >
              <option value="">-- Select Category --</option>
              {materialData.categories.map((c) => (
                <option key={c.categoryId} value={c.categoryName}>{c.categoryName}</option>
              ))}
            </select>
          </div>

          {/* Material Type */}
          <div className="form-group">
            <label>Material Type</label>
            <select 
              name="materialType" 
              value={formData.materialType} 
              onChange={handleChange}
            >
              <option value="">-- Select Type --</option>
              {materialData.types.map((t) => (
                <option key={t.typeId} value={t.typeName}>{t.typeName}</option>
              ))}
            </select>
          </div>

          {/* Unit */}
          <div className="form-group">
            <label>Unit</label>
            <select 
              name="unit" 
              value={formData.unit} 
              onChange={handleChange}
            >
              <option value="">-- Select Unit --</option>
              {materialData.units.map((u) => (
                <option key={u.unitId} value={u.unitName}>{u.unitName}</option>
              ))}
            </select>
          </div>

          {/* Brand Name */}
          <div className="form-group">
            <label>Brand Name</label>
            <input 
              type="text" 
              name="brandName" 
              value={formData.brandName} 
              onChange={handleChange} 
              placeholder="e.g. Raymonds"
            />
          </div>

          {/* Quantity */}
          <div className="form-group">
            <label>Quantity</label>
            <input 
              type="number" 
              name="quantity" 
              value={formData.quantity} 
              onChange={handleChange} 
            />
          </div>

          {/* Purchase Amount */}
          <div className="form-group">
            <label>Purchase Amount</label>
            <input 
              type="number" 
              name="purchaseAmount" 
              value={formData.purchaseAmount} 
              onChange={handleChange} 
            />
          </div>

          {/* Purchase Date */}
          <div className="form-group">
            <label>Purchase Date</label>
            <input 
              type="date" 
              name="purchaseDate" 
              value={formData.purchaseDate} 
              onChange={handleChange} 
            />
          </div>

          {/* Submit Action */}
          <div className="form-actions">
            <button type="submit" className="submit-btn">Submit</button>
          </div>
        </form>

        <div className="footer-note">
          <p>
            Note: <i>Purchase Id is generated on submit Ex: 
            {generatedId ? <strong> {generatedId}</strong> : " P_V001_07052018_C001_1"}</i>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaterialsEntryPage;