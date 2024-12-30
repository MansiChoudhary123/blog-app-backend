const AWS = require("aws-sdk");

/**
 * Function to upload a file to S3
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {string} fileName - The desired file name in S3
 * @param {string} mimeType - The MIME type of the file
 * @returns {Promise<Object>} - Returns an object containing the uploaded file's URL and details
 */
const uploadFileToS3 = async (fileBuffer, fileName, mimeType) => {
  // Configure S3
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName, // File name in the bucket
    Body: fileBuffer, // File content
    ContentType: mimeType, // File MIME type
    // ACL: "public-read", // Make the file publicly accessible (optional)
  };

  try {
    const result = await s3.upload(params).promise();
    return {
      success: true,
      message: "File uploaded successfully!",
      fileUrl: result.Location, // URL of the uploaded file
      s3Details: result, // Additional details from S3 response
    };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload file to S3.");
  }
};

module.exports = { uploadFileToS3 };
