import axios from "axios";

const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.REACT_APP_PINATA_SECRET_API_KEY;

console.log("KEY:", PINATA_API_KEY);
console.log("SECRET:", PINATA_SECRET_API_KEY);

export const uploadToPinata = async (data) => {
  try {
    const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

    const response = await axios.post(url, data, {
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
        "Content-Type": "application/json",
      },
    });

    return response.data.IpfsHash; 
  } catch (error) {
    console.error("Pinata upload error:", error);
    throw error;
  }
};