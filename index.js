const express = require("express");
const cors = require("cors");
const connectDb = require("./database");
require("dotenv").config();
const multer = require("multer");
const AWS = require("aws-sdk");
const app = express();
const userRoutes = require("./Routes/userRoutes");
const postRoutes = require("./Routes/postRoutes");
const categoryRoutes = require("./Routes/categoryRoutes");
app.use(cors());
app.use(express.json());

if (!process.env.MONGO_URI || !process.env.PORT) {
  throw new Error(
    "Missing required environment variables (MONGO_URI or PORT)."
  );
}

//database connect
connectDb();
// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Configure Multer
const upload = multer({ storage: multer.memoryStorage() });

app.use("/api", userRoutes);
app.use("/api", postRoutes);
app.use("/api", categoryRoutes);
// server start
const PORT = process.env.PORT || 5700;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
