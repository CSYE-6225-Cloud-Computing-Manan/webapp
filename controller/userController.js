const userService = require('../service/userService.js');
const healthService = require('../service/healthService.js');
const logger = require('../utils/logger.js');
const client = require('../middleware/statsD.js');

const createUser = async(request, response) => {
      const startTime = Date.now();
      response.set('Cache-Control', 'no-cache');
      client.increment('createUser controller');
      try{
            const isDbHealthy = await healthService.checkDbHealth();
            console.log('DB Health from user controller: ' + isDbHealthy);
            logger.info('DB Health from createUser API: ' + isDbHealthy);   
            if(!isDbHealthy){
                  logger.error('DB is not healthy');
                  const duration = Date.now() - startTime;
                  client.timing('createUser controller', duration);
                  return response.status(503).send();
            }
      }catch (error){
            logger.error('DB is not healthy: ', error);
            console.log('Error while creating user: ', error);
            const duration = Date.now() - startTime;
            client.timing('createUser controller', duration);
            return response.status(503).send();
      }

      try{
            console.log('content type at user controller: ' + request.headers['content-type']);
            console.log('Request body from createUser controller: ', request.body);

            if(Object.keys(request.query).length > 0 || request.headers['content-type'] != 'application/json'){
                  console.log('Invalid request body for user controller create method');
                  logger.error('Invalid request body for user controller create method');
                  const duration = Date.now() - startTime;
                  client.timing('createUser controller', duration);
                  return response.status(400).send(); //bad request
            }
            
            const {first_name, last_name, password, email, ...ignoredFields} = request.body;
            console.log('Email from createUser controller: ', email, ' first_name: ', first_name, ' last_name: ', last_name, ' password: ', password);

            const emailFormat = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            
            if (Object.keys(ignoredFields).length > 0) {
                  console.log('Invalid request body, ignored');
                  logger.error('Invalid request body, ignored');
                  const duration = Date.now() - startTime;
                  client.timing('createUser controller', duration);
                  return response.status(400).send();
              }

            if(!email.match(emailFormat)){
                  console.log('Invalid email format');
                  logger.error('Invalid email format');
                  const duration = Date.now() - startTime;
                  client.timing('createUser controller', duration);
                  return response.status(400).send(); //bad request
            }

            if (!email || !first_name || !last_name || !password) {
                  console.log("Invalid types");
                  logger.error('Invalid field values');
                  const duration = Date.now() - startTime;
                  client.timing('createUser controller', duration);
                  return response.status(400).send(); //bad request
            }

            if(typeof email !== 'string' || typeof first_name !== 'string' || typeof last_name !== 'string' || typeof password !== 'string'){
                  console.log('Invalid request body for user controller create method');
                  logger.error('Invalid field types in the request body');
                  const duration = Date.now() - startTime;
                  client.timing('createUser controller', duration);
                  return response.status(400).send(); //bad request
            }

            if(password.trim() === '' || password.length < 8){
                  console.log('Password length is smaller than 8 characters');
                  logger.error('Password length is smaller than 8 characters');
                  const duration = Date.now() - startTime;
                  client.timing('createUser controller', duration);
                  return response.status(400).send(); //bad request
            }
            
            const user = await userService.createUser(email, first_name, last_name, password);

            if(user === null){
                  console.log('User already exists: ' + user);
                  logger.error('User already exists: ' + user);
                  const duration = Date.now() - startTime;
                  client.timing('createUser controller', duration);
                  return response.status(400).send(); //bad request
            }

            logger.info('User created successfully: ' + user);
            const duration = Date.now() - startTime;
            client.timing('createUser controller', duration);
            return response.status(201).send({
                  Id: user.id,
                  first_name: user.first_name,
                  last_name: user.last_name,
                  email: user.email,
                  account_created: user.account_created,
                  account_updated: user.account_updated
            }); //returning when user got created susccessfully
      } catch(error){
            console.log('Error while creating user: ', error);
            logger.error('Error while creating user: ', error);
            const duration = Date.now() - startTime;
            client.timing('createUser controller', duration);
            return response.status(503).send();
      }
}

const getUser = async(request, response) => {
      client.increment('getUser controller');
      const startTime = Date.now();
      response.set('Cache-Control', 'no-cache');
      try{
            const isDbHealthy = await healthService.checkDbHealth();
            console.log('DB Health from user controller: ' + isDbHealthy);
            logger.info('DB Health from getUser API: ' + isDbHealthy);
            if(!isDbHealthy){
                  logger.error('DB is not healthy');
                  const duration = Date.now() - startTime;
                  client.timing('getUser controller', duration);
                  return response.status(503).send();
            }
      }catch (error){
            logger.error('DB is not healthy: ', error);
            console.log('Error while getting user: ', error);
            const duration = Date.now() - startTime;
            client.timing('getUser controller', duration);
            return response.status(503).send();
      }

      try{
            //console.log('request body at user controller at get: ' + " " + request.headers['content-type']);
            const contentLength = request.headers['content-length'];
            if(Object.keys(request.body).length > 0  || Object.keys(request.query).length > 0 || (contentLength != undefined && contentLength > 0)){
                  logger.error('Invalid request body for user controller get method');
                  console.log('Invalid request query for user controller get method' + request.headers['content-type']);
                  const duration = Date.now() - startTime;
                  client.timing('getUser controller', duration);
                  return response.status(400).send();
            }
            const username = request.authenticatedUser.username;
            //const password = request.authenticatedUser.password;
            console.log('Username from getUser controller: ', username);
            const user = await userService.getUser(username);

            if(user === null){
                  console.log('User not found: ' + user);
                  logger.error('User not found: ' + user);
                  const duration = Date.now() - startTime;
                  client.timing('getUser controller', duration);
                  return response.status(403).send(); //user not authenticated and not found
            }

            logger.info('User found successfully: ' + user);
            const duration = Date.now() - startTime;
            client.timing('getUser controller', duration);
            return response.status(200).send({
                  Id: user.id,
                  email: user.email,
                  first_name: user.first_name,
                  last_name: user.last_name,
                  account_created: user.account_created,
                  account_updated: user.account_updated
            });
            
      } catch(error){
            console.log('Error while getting user: ', error);
            logger.error('Error while getting user: ', error);
            const duration = Date.now() - startTime;
            client.timing('getUser controller', duration);
            return response.status(503).send();
      }
}

const updateUser = async(request, response) => {
      const startTime = Date.now();
      client.increment('updateUser controller');
      response.set('Cache-Control', 'no-cache');
      try{
            const isDbHealthy = await healthService.checkDbHealth();
            console.log('DB Health from user controller: ' + isDbHealthy);
            logger.info('DB Health from updateUser API: ' + isDbHealthy);
            if(!isDbHealthy){
                  logger.error('DB is not healthy');
                  const duration = Date.now() - startTime;
                  client.timing('updateUser controller', duration);
                  return response.status(503).send();
            }
      }catch (error){
            logger.error('DB is not healthy: ', error);
            console.log('Error while getting user: ', error);
            const duration = Date.now() - startTime;
            client.timing('updateUser controller', duration);
            return response.status(503).send();
      }

      try{
            if(Object.keys(request.query).length > 0 || request.headers['content-type'] != 'application/json'){
                  console.log('Invalid request body for user controller update method');
                  logger.error('Invalid request body for user controller update method');
                  const duration = Date.now() - startTime;
                  client.timing('updateUser controller', duration);
                  return response.status(400).send();
            }

            const { first_name, last_name, password, email, ...ignoredFields} = request.body;
            console.log('Request body from updateUser controller');
            console.log('first_name: ', first_name, ' last_name: ', last_name, ' password: ', password, ' email: ', email);

            const emailFormat = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

            if(Object.keys(ignoredFields).length > 0){
                  console.log('Invalid request body, ignored at update');
                  logger.error('Invalid request body, extra fields');
                  const duration = Date.now() - startTime;
                  client.timing('updateUser controller', duration);
                  return response.status(400).send();
            }

            if(!first_name || !last_name || !password || !email){
                  console.log('Invalid request body for user controller update method');
                  logger.error('Invalid field value for user controller update method');
                  const duration = Date.now() - startTime;
                  client.timing('updateUser controller', duration);
                  return response.status(400).send();
            }     

            if(typeof first_name !== 'string' || typeof last_name !== 'string' || typeof password !== 'string' || typeof email !== 'string'){
                  console.log('Invalid attribute types user controller update method');
                  logger.error('Invalid attribute types user controller update method');
                  const duration = Date.now() - startTime;
                  client.timing('updateUser controller', duration);
                  return response.status(400).send();
            }

            if(password.trim() === '' || password.length < 8){
                  console.log('Password length is smaller than 8 characters');
                  logger.error('Password length is smaller than 8 characters');
                  const duration = Date.now() - startTime;
                  client.timing('updateUser controller', duration);
                  return response.status(400).send();
            }

            if(!email.match(emailFormat)){
                  console.log('Invalid email format');
                  logger.error('Invalid email format');
                  const duration = Date.now() - startTime;
                  client.timing('updateUser controller', duration);
                  return response.status(400).send();
            }

            const username = request.authenticatedUser.username;

            if(username !== email){
                  console.log('Username and email do not match');
                  logger.error('Username and email do not match');
                  const duration = Date.now() - startTime;
                  client.timing('updateUser controller', duration);
                  return response.status(400).send();
            }
            
            console.log('Username from updateUser controller: ', username);

            const user = await userService.updateUser(username, first_name, last_name, password);

            if(!user){
                  console.log('User not found');
                  logger.error('User not found: ' + user);
                  const duration = Date.now() - startTime;
                  client.timing('updateUser controller', duration);
                  return response.status(403).send();
            }
            
            logger.info('User updated successfully: ' + user);
            const duration = Date.now() - startTime;
            client.timing('updateUser controller', duration);
            return response.status(204).send();
      } catch(error){
            console.log('Error while updating user: ', error);
            logger.error('Error while updating user: ', error);
            const duration = Date.now() - startTime;
            client.timing('updateUser controller', duration);
            return response.status(503).send();
      }

};

const uploadProfilePic = async(request, response) => {
      const startTime = Date.now();
      client.increment('uploadProfilePic controller');
      response.set('Cache-Control', 'no-cache');
      try{
            const isDbHealthy = await healthService.checkDbHealth();
            console.log('DB Health from user controller: ' + isDbHealthy);
            logger.info('DB Health from uploadProfilePic API: ' + isDbHealthy);
            if(!isDbHealthy){
                  logger.error('DB is not healthy');
                  const duration = Date.now() - startTime;
                  client.timing('uploadProfilePic controller', duration);
                  return response.status(503).send();
            }
      }catch (error){
            logger.error('DB is not healthy: ', error);
            console.log('Error while getting user: ', error);
            const duration = Date.now() - startTime;
            client.timing('uploadProfilePic controller', duration);
            return response.status(503).send();
      }

      try{
            if(Object.keys(request.query).length > 0 || request.headers['content-type'] != 'multipart/form-data'){
                  logger.error('Invalid request body for uploadProfilePic method');
                  console.log('Invalid request body for uploadProfilePic method');
                  const duration = Date.now() - startTime;
                  client.timing('uploadProfilePic controller', duration);
                  return response.status(400).send();
            }

            const username = request.authenticatedUser.username;
            console.log('Username from uploadProfilePic controller: ', username);

            const file = request.file;
            console.log('File from uploadProfilePic controller: ', file);

            if(!file || file===undefined){
                  console.log('File not found: ' + file);
                  logger.error('File not found: ' + file);
                  const duration = Date.now() - startTime;
                  client.timing('uploadProfilePic controller', duration);
                  return response.status(400).send();
            }

            if(file.mimetype.includes('image/') === false){
                  console.log('Invalid file mimetype: ' + file.mimetype);
                  logger.error('Invalid file mimetype: ' + file.mimetype);
                  const duration = Date.now() - startTime;
                  client.timing('uploadProfilePic controller', duration);
                  return response.status(400).send();
            }

            const ifProfilePicExists = await userService.getProfilePic(username);

            if(ifProfilePicExists){
                  console.log('Profile pic already exists: ' + ifProfilePicExists);
                  logger.error('Profile pic already exists: ' + ifProfilePicExists);
                  const duration = Date.now() - startTime;
                  client.timing('uploadProfilePic controller', duration);
                  return response.status(400).send();
            }

            const profilePic = await userService.uploadProfilePic(username, request);

            if(!profilePic){
                  console.log('profile pic not uploaded');
                  logger.error('profile pic not uploaded: ' + profilePic);
                  const duration = Date.now() - startTime;
                  client.timing('uploadProfilePic controller', duration);
                  return response.status(403).send();
            }

            logger.info('Profile pic uploaded successfully: ' + profilePic);
            const duration = Date.now() - startTime;
            client.timing('uploadProfilePic controller', duration);
            return response.status(201).send();
      } catch(error){
            console.log('Error while updating user: ', error);
            logger.error('Error while updating user: ', error);
            const duration = Date.now() - startTime;
            client.timing('uploadProfilePic controller', duration);
            return response.status(503).send();
      }

}

const getProfilePic = async(request, response) => {
      const startTime = Date.now();
      client.increment('getProfilePic controller');
      response.set('Cache-Control', 'no-cache');
      try{
            const isDbHealthy = await healthService.checkDbHealth();
            logger.info('DB Health from getProfilePic API: ' + isDbHealthy);
            console.log('DB Health from user controller: ' + isDbHealthy);
            if(!isDbHealthy){
                  logger.error('DB is not healthy');
                  const duration = Date.now() - startTime;
                  client.timing('getProfilePic controller', duration);
                  return response.status(503).send();
            }
      }catch (error){
            logger.error('DB is not healthy: ', error);
            console.log('Error while getting user: ', error);
            const duration = Date.now() - startTime;
            client.timing('getProfilePic controller', duration);
            return response.status(503).send();
      }

      try{
            const contentLength = request.headers['content-length'];
            if(Object.keys(request.query).length > 0 || Object.keys(request.body).length > 0 || (contentLength != undefined && contentLength > 0)){
                  console.log('Invalid request body for getProfilePic method');
                  logger.error('Invalid request body for getProfilePic method');
                  const duration = Date.now() - startTime;
                  client.timing('getProfilePic controller', duration);
                  return response.status(400).send();
            }

            const username = request.authenticatedUser.username;
            console.log('Username from getProfilePic controller: ', username);

            const profilePic = await userService.getProfilePic(username);

            if(!profilePic){
                  console.log('Profile Pic not found');
                  logger.error('Profile Pic not found: ' + profilePic);
                  const duration = Date.now() - startTime;
                  client.timing('getProfilePic controller', duration);
                  return response.status(403).send();
            }

            logger.info('Profile pic found successfully:' + profilePic);
            const duration = Date.now() - startTime;
            client.timing('getProfilePic controller', duration);
            return response.status(200).send(profilePic);
      } catch(error){
            console.log('Error while getting profile pic: ', error);
            logger.error('Error while getting profile pic ', error);
            const duration = Date.now() - startTime;
            client.timing('getProfilePic controller', duration);
            return response.status(503).send();
      }

}

const deleteProfilePic = async(request, response) => {
      const startTime = Date.now();
      client.increment('deleteProfilePic controller');
      response.set('Cache-Control', 'no-cache');
      try{
            const isDbHealthy = await healthService.checkDbHealth();
            console.log('DB Health from user controller: ' + isDbHealthy);
            logger.info('DB Health from deleteProfilePic API: ' + isDbHealthy);
            if(!isDbHealthy){
                  logger.error('DB is not healthy');
                  const duration = Date.now() - startTime;
                  client.timing('deleteProfilePic controller', duration);
                  return response.status(503).send();
            }
      }catch (error){
            logger.error('DB is not healthy: ', error);
            console.log('Error while getting user: ', error);
            const duration = Date.now() - startTime;
            client.timing('deleteProfilePic controller', duration);
            return response.status(503).send();
      }

      try{
            const contentLength = request.headers['content-length'];
            if(Object.keys(request.query).length > 0 || Object.keys(request.body).length > 0 || (contentLength != undefined && contentLength > 0)){
                  logger.error('Invalid request body for deleteProfilePic method');
                  console.log('Invalid request body for deleteProfilePic method');
                  const duration = Date.now() - startTime;
                  client.timing('deleteProfilePic controller', duration);
                  return response.status(400).send();
            }

            const username = request.authenticatedUser.username;
            console.log('Username from deleteProfilePic controller: ', username);

            const ifProfilePicExists = await userService.getProfilePic(username);

            if(!ifProfilePicExists){
                  console.log('Profile pic not found');
                  logger.error('Profile pic not found, cannot delete: ' + ifProfilePicExists);
                  const duration = Date.now() - startTime;
                  client.timing('deleteProfilePic controller', duration);
                  return response.status(400).send();
            }

            const profilePic = await userService.deleteProfilePic(username);

            if(!profilePic){
                  console.log('Profile pic not deleted');
                  logger.error('Profile pic not deleted: ' + profilePic);
                  const duration = Date.now() - startTime;
                  client.timing('deleteProfilePic controller', duration);
                  return response.status(403).send();
            }

            logger.info('Profile pic deleted successfully: ' + profilePic);
            const duration = Date.now() - startTime;
            client.timing('deleteProfilePic controller', duration);
            return response.status(204).send();
      } catch(error){
            console.log('Error while updating user: ', error);
            logger.error('Error while updating user: ', error);
            const duration = Date.now() - startTime;
            client.timing('deleteProfilePic controller', duration);
            return response.status(503).send();
      }

}

module.exports = { createUser, getUser, updateUser, uploadProfilePic, getProfilePic, deleteProfilePic };