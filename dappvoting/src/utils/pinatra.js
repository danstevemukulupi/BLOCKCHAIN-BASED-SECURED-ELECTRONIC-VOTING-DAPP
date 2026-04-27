import axios from "axios";

//const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
//const PINATA_SECRET_API_KEY = process.env.REACT_APP_PINATA_SECRET_API_KEY;

//console.log("KEY:", PINATA_API_KEY);
//console.log("SECRET:", PINATA_SECRET_API_KEY);

export const uploadToPinata = async (data) => {
  try {
    //const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

    const response = await axios.post (
      `${process.env.REACT_APP_API_URL}/upload`,
      data
    
    );

    // Backedn to return a valid hash 
    if (!response.data || !response.data.IpfsHash) { 
      throw new Error("IPFS upload failed or missing IpfsHash");
    }

    const ipfsHash = response.data.IpfsHash; 
    return ipfsHash;

  } catch (error) {
    console.error("Upload eror (via backend):", error.response?.data || error.message);
    throw error;
  }
};