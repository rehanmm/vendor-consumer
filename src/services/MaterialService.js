// services/MaterialService.js

// Based on your code, Vendors are on port 8088, others on 8087
const BASE_URL = process.env.BASE_URL;
/**
 * Generic helper to fetch JSON data
 */


export const savePurchaseEntry = async (payload) => {
  // REPLACE with your actual save endpoint
  const url = `${BASE_URL}/postPurchaseEntry`; 

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Save Failed: ${response.status} ${response.statusText}`);
    }

    // Return response text or json depending on what your backend sends back
    return await response.text(); 

  } catch (error) {
    console.error("Error saving purchase:", error);
    throw error;
  }
};



const fetchJson = async (url) => {
  const response = await fetch(url);
  console.log(response);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return response.json();
};

export const getVendors = () => {
  return fetchJson(`${BASE_URL}/getVendors`);
};

export const getCategories = () => {
  return fetchJson(`${BASE_URL}/getMaterialCategories`);
};

export const getTypes = () => {
  return fetchJson(`${BASE_URL}/getMaterialTypes`);
};

export const getUnits = () => {
  return fetchJson(`${BASE_URL}/getUnitDetails`);
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
