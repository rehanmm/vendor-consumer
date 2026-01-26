// services/MaterialService.js

// Based on your code, Vendors are on port 8088, others on 8087
const VENDOR_API_BASE = "http://localhost:8088/vendor/controller";
const INVENTORY_API_BASE = "http://localhost:8087"; 

/**
 * Generic helper to fetch JSON data
 */
const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return response.json();
};

export const getVendors = () => {
  return fetchJson(`${VENDOR_API_BASE}/getVendors`);
};

export const getCategories = () => {
  return fetchJson(`${INVENTORY_API_BASE}/material/controller/getCategoryDetails`);
};

export const getTypes = () => {
  return fetchJson(`${INVENTORY_API_BASE}/type/controller/getTypeDetails`);
};

export const getUnits = () => {
  return fetchJson(`${INVENTORY_API_BASE}/unit/controller/getUnitDetails`);
};

/**
 * Helper to fetch all dropdown data in parallel
 */
export const fetchAllMaterialFormData = async () => {
  try {
    const [vendors, categories, types, units] = await Promise.all([
      getVendors(),
      getCategories(),
      getTypes(),
      getUnits()
    ]);

    return { vendors, categories, types, units };
  } catch (error) {
    console.error("Error fetching material form data:", error);
    throw error;
  }
};