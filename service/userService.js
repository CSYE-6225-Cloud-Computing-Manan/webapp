const User = require('../models/userSchema.js');
const Image = require('../models/imageSchema.js');
const s3 = require('../middleware/S3.js');
const bcrypt = require('bcrypt');
const fs = require('fs');
const logger = require('../utils/logger.js');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink)

const createUser = async(email, first_name, last_name, password) => {
      try{
            const existingUser = await User.findOne({ where: {
                  email: email
            }});
            if(existingUser){
                  logger.error('User already exists from createUser service');
                  return null;
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const user = await User.create({
                  email: email,
                  first_name: first_name,
                  last_name: last_name,
                  password: hashedPassword
            });

            if(!user){
                  logger.error('Error while creating user from createUser service');
                  return null;
            }

            logger.info('User created successfully from createUser service');
            return user;
      }catch(error){
            logger.error('Error while creating user from createUser service: ' + error);
            console.log('Error while creating user: ' + error);
            return null;
      }
};

const getUser = async(username) => {
      try{
            const user = await User.findOne({ where: {
                  email: username
            }
      });

            if(!user){
                  logger.error('User not found from getUser service');
                  return null;
            }

            logger.info('User found successfully from getUser service');
            return user;
      }catch(error){
            logger.error('Error while getting user from getUser service: ' + error);
            console.log('Error while getting user: ', error);
            return null;
      }
};

const updateUser = async(username, first_name, last_name, password) => {
      try{
            const user = await User.findOne({ where: {
                  email: username
            }});

            if(!user){
                  logger.error('User not found from updateUser service');
                  return null;
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.first_name = first_name;
            user.last_name = last_name;
            user.password = hashedPassword;
            await user.save();

            return user;
      }catch(error){
            logger.error('Error while updating user from updateUser service: ' + error);
            console.log('Error while updating user: ', error);
            return null;
      }
};

const uploadProfilePic = async(username, request) => {
      try{
            const user = await User.findOne({ where: {
                  email: username
            }});

            if(!user){
                  logger.error('User not found from uploadProfilePic service');
                  return null;
            }

            console.log('uploading profile pic to S3');
            const result = await s3.uploadFile(request.file, user.id);
            console.log(result);

            await unlinkAsync(request.file.path);

            if(result){
                  console.log('Profile pic uploaded to S3');
                  logger.info('Profile pic uploaded to S3');
                  const profilePic = await Image.create({
                        file_name: request.file.originalname,
                        url: request.file.location,
                        user_id: user.id
                  });

                  logger.info('Profile pic uploaded successfully from uploadProfilePic service to DB');
                  return profilePic;

            }else{
                  logger.error('Error while uploading profile pic to S3: ' + error);
                  console.log('Error while uploading profile pic to S3');
                  return null;
            }
      }catch(error){
            logger.error('Error while uploading profile pic from uploadProfilePic service: ' + error);
            console.log('Error while uploading profile pic: ', error);
            return null;
      }
}

const getProfilePic = async(username) => {
      try{
            const user = await User.findOne({ where: {
                  email: username
            }});

            if(!user){
                  logger.error('User not found from getProfilePic service');
                  return null;
            }

            const profilePic = await Image.findOne({ where: {
                  user_id: user.id
            }});

            if(!profilePic){
                  logger.error('Profile pic not found from getProfilePic service');
                  return null;
            }

            return profilePic;
      }catch(error){
            logger.error('Error while getting profile pic from getProfilePic service: ' + error);
            console.log('Error while getting profile pic: ', error);
            return null;
      }
}

const deleteProfilePic = async(username) => {
      try{
            const user = await User.findOne({ where: {
                  email: username
            }});

            if(!user){
                  logger.error('User not found from deleteProfilePic service');
                  return null;
            }

            const profilePic = await Image.findOne({ where: {
                  user_id: user.id
            }});

            if(!profilePic){
                  logger.error('Profile pic not found from deleteProfilePic service');
                  return null;
            }

            const result = await s3.deleteFile(profilePic.file_name);
            console.log(result);

            if(result){
                  logger.info('Profile pic deleted from S3');
                  console.log('Profile pic deleted from S3');
                  await profilePic.destroy();
                  return true;
            }else{
                  logger.error('Error while deleting profile pic from S3: ' + error);
                  console.log('Error while deleting profile pic from S3');
                  return null;
            }
      }catch(error){
            logger.error('Error while deleting profile pic from deleteProfilePic service: ' + error);
            console.log('Error while deleting profile pic: ', error);
            return null;
      }
}

module.exports = { createUser, getUser, updateUser, uploadProfilePic, getProfilePic, deleteProfilePic };