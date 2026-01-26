import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- 1. Import useNavigate
import './MaterialsEntryPage.css'; 
import { dummyCategories, dummyTypes, dummyVendors, dummyUnits } from '../../dummyData/MaterialPageDummy';
import { fetchAllMaterialFormData,savePurchaseEntry } from '../../services/MaterialService';

const USE_DUMMY_DATA = false;

const MaterialsEntryPage = () => {
  const navigate = useNavigate(); // <--- 2. Initialize Hook

  // --- State for Form Fields ---
  // const [formData, setFormData] = useState({
  //   vendorName: '',
  //   materialCategory: '',
  //   materialType: '',
  //   unit: '',
  //   brandName: '',
  //   quantity: '',
  //   purchaseAmount: '',
  //   purchaseDate: ''
  // });
  const [formData, setFormData] = useState({
    vendorName: '',
    materialCategoryId:'',
    materialTypeId:'',
    brandName: '',
    unitId:'',
    quantity: '',
    purchaseAmount: '',
    purchaseDate: '',
    materialCategoryName: '',
    materialTypeName: '',
    MaterialUnitName: '',
  });
/*
private long purchaseId;
  private String transactionId;
  private String vendorName;
  private String materialCategoryId;
  private String materialTypeId;
  private String brandName;
  private String unitId;
  private Integer quantity;
  private Double purchaseAmount;
  private Double balance;
  private Date purchaseDate;
  private String materialCategoryName;
  private String materialTypeName;
  private String materialUnitName;
  private String status;
*/
  const [generatedId, setGeneratedId] = useState('');

  // --- State for Data (Dropdowns) ---
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
      if (USE_DUMMY_DATA) {
        setVendorOptions(dummyVendors);
        setMaterialData({ categories: dummyCategories, types: dummyTypes, units: dummyUnits });
      } else {
        try {
          const data = await fetchAllMaterialFormData();
          console.log(data);
          setVendorOptions(data.vendors);
          setMaterialData({ categories: data.categories, types: data.types, units: data.units });
        } catch (err) {
          setError("API Connection Failed. Using Dummy Data.");
          setVendorOptions(dummyVendors);
          setMaterialData({ categories: dummyCategories, types: dummyTypes, units: dummyUnits });
        }
      }
    };
    loadData();
  }, []);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generatePurchaseId = () => {
    const selectedVendor = vendorOptions.find(v => v.vendorName === formData.vendorName);
    const vCode = selectedVendor ? selectedVendor.vendorId : 'UNK';
    
    let dateStr = '00000000';
    if(formData.purchaseDate) {
      const [year, month, day] = formData.purchaseDate.split('-');
      dateStr = `${month}${day}${year}`; 
    }

    const selectedCat = materialData.categories.find(c => c.categoryName === formData.materialCategory);
    const cCode = selectedCat ? selectedCat.categoryId : 'XXX';

    return `P_${vCode}_${dateStr}_${cCode}_1`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = generatePurchaseId();
    setGeneratedId(newId);
    
    const payload = { ...formData, purchaseId: newId };
    console.log("Submitting Payload:", payload);
       savePurchaseEntry(payload)
      .then(console.log)
      .catch(console.error);
        alert(`Success! Entry saved with ID: ${newId}`);
    alert("Form Submitted! Redirecting to Report...");

    // <--- 3. NAVIGATE TO REPORT PAGE WITH DATA --->
    // We pass the vendorName and use the purchaseDate for both 'from' and 'to'
    navigate('/vendorReport', { 
      state: { 
        vendorName: formData.vendorName,
        fromDate: formData.purchaseDate,
        toDate: formData.purchaseDate // Setting range to the specific purchase date
      } 
    });
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