
import React, { useState, useEffect } from 'react';
import './MaterialsEntryPage.css'; // Assuming you save the CSS below in this file

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

  // --- State for "Microservice" Data ---
  const [vendorOptions, setVendorOptions] = useState([]);
  const [materialData, setMaterialData] = useState({
    categories: [],
    types: [],
    units: []
  });

  // --- Simulate Microservice Calls ---
  useEffect(() => {
    // Simulating Vendor Application Microservice
    const fetchVendorData = () => {
      const dummyVendors = [
        { id: 'v1', name: 'XYZ Enterprises', code: 'XYZ' },
        { id: 'v2', name: 'ABC Supply Co', code: 'ABC' },
        { id: 'v3', name: 'Global Textiles', code: 'GLO' }
      ];
      setVendorOptions(dummyVendors);
    };

    // Simulating Material Application Microservice
    const fetchMaterialData = () => {
      const dummyMaterials = {
        categories: [
          { name: 'Cloth', code: 'CLO' },
          { name: 'Steel', code: 'STL' },
          { name: 'Wood', code: 'WOD' }
        ],
        types: ['Linen', 'Cotton', 'Silk', 'Polyester'],
        units: ['Metre', 'Kilogram', 'Liter', 'Square Foot']
      };
      setMaterialData(dummyMaterials);
    };

    fetchVendorData();
    fetchMaterialData();
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
    // Logic: P_XYZ_07052018_CLO_1
    // Format: P_{VendorCode}_{DateDDMMYYYY}_{CategoryCode}_1
    
    // 1. Get Vendor Code
    const selectedVendor = vendorOptions.find(v => v.name === formData.vendorName);
    const vCode = selectedVendor ? selectedVendor.code : 'UNK';

    // 2. Format Date (YYYY-MM-DD -> DDMMYYYY)
    let dateStr = '00000000';
    if(formData.purchaseDate) {
      const [year, month, day] = formData.purchaseDate.split('-');
      dateStr = `${month}${day}${year}`; 
      // Note: The example image uses 0705 (July 5th) for Month/Day order based on standard US/ISO mix, 
      // but usually DDMMYYYY is preferred in enterprise. I will match the image example: MonthDayYear.
    }

    // 3. Get Category Code
    const selectedCat = materialData.categories.find(c => c.name === formData.materialCategory);
    const cCode = selectedCat ? selectedCat.code : 'XXX';

    return `P_${vCode}_${dateStr}_${cCode}_1`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = generatePurchaseId();
    setGeneratedId(newId);
    alert(`Form Submitted!\nGenerated Purchase ID: ${newId}`);
  };

  return (
    <div className="container">
      <div className="form-wrapper">
        {/* Header */}
        <div className="header">
          <h2>Materials Purchased Entry</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Vendor Name - From Vendor Microservice */}
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
                <option key={v.id} value={v.name}>{v.name}</option>
              ))}
            </select>
          </div>

          {/* Material Category - From Material Microservice */}
          <div className="form-group">
            <label>Material Category</label>
            <select 
              name="materialCategory" 
              value={formData.materialCategory} 
              onChange={handleChange}
              required
            >
              <option value="">-- Select Category --</option>
              {materialData.categories.map((c, index) => (
                <option key={index} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Material Type - From Material Microservice */}
          <div className="form-group">
            <label>Material Type</label>
            <select 
              name="materialType" 
              value={formData.materialType} 
              onChange={handleChange}
            >
              <option value="">-- Select Type --</option>
              {materialData.types.map((t, index) => (
                <option key={index} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Unit - From Material Microservice */}
          <div className="form-group">
            <label>Unit</label>
            <select 
              name="unit" 
              value={formData.unit} 
              onChange={handleChange}
            >
              <option value="">-- Select Unit --</option>
              {materialData.units.map((u, index) => (
                <option key={index} value={u}>{u}</option>
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

        {/* Footer Note */}
        <div className="footer-note">
          <p>
            Note: <i>Purchase Id is generated on submit Ex: 
            {generatedId ? <strong> {generatedId}</strong> : " P_XYZ_07052018_CLO_1"}</i>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaterialsEntryPage;