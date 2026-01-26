// services/VendorService.js

const API_BASE_URL = "http://localhost:8080/inventorymanagementsystem";

/**
 * Fetches the vendor purchase report.
 * * @param {string} vendorName - The name of the vendor
 * @param {string} fromDate - Start date in YYYY-MM-DD format
 * @param {string} toDate - End date in YYYY-MM-DD format
 * @returns {Promise<Array>} - The list of report items
 */
export const fetchVendorReportData = async (vendorName, fromDate, toDate) => {
  const url = `${API_BASE_URL}/report/controller/getPurchaseDetails`;

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