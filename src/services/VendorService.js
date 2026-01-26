// services/VendorService.js

const BASE_URL = process.env.REACT_APP_BASE_URL;

/**
 * Fetches the vendor purchase report.
 * * @param {string} vendorName - The name of the vendor
 * @param {string} fromDate - Start date in YYYY-MM-DD format
 * @param {string} toDate - End date in YYYY-MM-DD format
 * @returns {Promise<Array>} - The list of report items
 */


export const fetchVendorList = async () => {
  try {
    console.log(BASE_URL);
    const response = await fetch(`${BASE_URL}/getVendors`);
    if (!response.ok) {
      throw new Error("Failed to fetch vendors");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching vendor list:", error);
    throw error;
  }
};


export const fetchVendorReportData = async (vendorName, fromDate, toDate) => {
  const url = `${BASE_URL}/report/controller/getPurchaseDetails`;

  // Construct the payload exactly as the API expects
  const payload = {
    fromDate: `${fromDate}T00:00:00`,
    toDate: `${toDate}T00:00:00`,
    vendorName: vendorName
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    // Re-throw the error so the component can handle it (e.g., show error message)
    console.error("VendorService Error:", error);
    throw error;
  }
};