require("dotenv/config");
const S3 = require('aws-sdk/clients/s3');
const fs = require("fs");



const s3 = new S3({
  region: process.env.AWS_REGION || 'us-east-1',
});


function uploadFile(file, userId) {
  console.log("AWS_REGION: " + process.env.AWS_REGION);
  console.log("AWS_BUCKET_NAME: " + process.env.AWS_BUCKET_NAME);
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Body: fileStream,
    Key: userId + '/' + file.originalname,
  };

  return s3.upload(uploadParams).promise(); // this will upload file to S3

}


function deleteFile(filename, userId) {
  //console.log('filename: ' + userId + '/' + uuidv4() + '/' + filename);
  const deleteParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: userId + '/' + filename,
  };

  return s3.deleteObject(deleteParams).promise();
}


module.exports = { uploadFile, deleteFile };



