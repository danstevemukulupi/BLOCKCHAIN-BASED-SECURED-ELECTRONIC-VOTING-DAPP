const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const emailRoutes = require("./routes/emailRoutes");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Local data store file
const DATA_FILE = path.join(__dirname, "ipfs-data.json");

const readStore = () => {
  if (!fs.existsSync(DATA_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return {};
  }
};

const writeStore = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

app.get("/", (req, res) => {
  res.send("Welcome to the Mapovote backend server!");
});

app.get("/debug-env", (req, res) => {
  res.json({
    pinata_key_set: !!process.env.PINATA_API_KEY,
    pinata_secret_set: !!process.env.PINATA_SECRET_API_KEY,
    store_size: Object.keys(readStore()).length,
  });
});

// Upload to Pinata AND save locally
app.post("/upload", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      req.body,
      {
        headers: {
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    // Save data locally with IPFS hash as key
    const store = readStore();
    store[response.data.IpfsHash] = req.body;
    writeStore(store);

    console.log("Uploaded and saved locally:", response.data.IpfsHash);
    res.json(response.data);

  } catch (err) {
    console.error("Pinata error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// Get voter data from local store
app.get("/voter/:hash", (req, res) => {
  try {
    const store = readStore();
    const data = store[req.params.hash];
    if (!data) {
      return res.status(404).json({ error: "Voter not found for hash: " + req.params.hash });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get candidate data from local store
app.get("/candidate/:hash", (req, res) => {
  try {
    const store = readStore();
    const data = store[req.params.hash];
    if (!data) {
      return res.status(404).json({ error: "Candidate not found for hash: " + req.params.hash });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// annoucement 
let announcement = "";

app.post("/announcement", (req, res) => {
  announcement = req.body.message;
  res.json({ message: announcement });
});

app.get("/announcement", (req, res) => {
  res.json({ message: announcement });
}); 


app.use("/api", emailRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});