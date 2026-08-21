// backend/services/agent/config/s3.js
import { S3Client } from "@aws-sdk/client-s3";

const s3Config = {
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
};

// 🌟 THE MAGIC FOR MINIO (LOCAL DEV)
// If S3_ENDPOINT is set in .env, we redirect SDK requests to our local MinIO
if (process.env.S3_ENDPOINT) {
    s3Config.endpoint = process.env.S3_ENDPOINT;
    s3Config.forcePathStyle = true; // Required for MinIO bucket routing
}

export const s3 = new S3Client(s3Config);