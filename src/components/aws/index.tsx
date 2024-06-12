"use client";

import { useState } from "react";
import AWS from "aws-sdk";

const UploadAudio = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadToS3 = async () => {
    if (!selectedFile) return;

    const S3_BUCKET = "duality";
    const REGION = "eu-west-3"; // e.g., 'us-east-1'
    const ACCESS_KEY = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY;
    const SECRET_ACCESS_KEY = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;

    AWS.config.update({
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_ACCESS_KEY,
      region: REGION,
    });

    const s3 = new AWS.S3();

    const params = {
      Bucket: S3_BUCKET,
      Key: selectedFile.name,
      Body: selectedFile,
      ContentType: "audio/webm",
    };

    setUploading(true);

    await s3
      .upload(params)
      .on("httpUploadProgress", (progress) => {
        const percentUploaded = Math.round(
          (progress.loaded / progress.total) * 100
        );
        setUploadProgress(percentUploaded);
      })
      .promise();

    setUploading(false);
    setUploadProgress(0);
    setSelectedFile(null);
    alert("Upload successful!");
  };

  return (
    <div>
      <h2>Upload Audio</h2>
      <input type="file" accept="audio/webm" onChange={handleFileChange} />
      <button onClick={uploadToS3} disabled={uploading || !selectedFile}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {uploading && <p>Progress: {uploadProgress}%</p>}
    </div>
  );
};

export default UploadAudio;
