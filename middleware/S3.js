require("dotenv/config");
const S3 = require('aws-sdk/clients/s3');
const fs = require("fs");
const {
  v4: uuidv4,
} = require('uuid');



const s3 = new S3({
  region: process.env.AWS_REGION || 'us-east-1',
});

function uploadFile(file, userId) {

  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Body: fileStream,
    Key: userId + '/' + uuidv4() + '/' + file.originalname,
  };

  return s3.upload(uploadParams).promise(); // this will upload file to S3

}


function deleteFile(filename) {
  const deleteParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filename,
  };

  return s3.deleteObject(deleteParams).promise();
}


module.exports = { uploadFile, deleteFile };



