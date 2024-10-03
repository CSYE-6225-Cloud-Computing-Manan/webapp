const userService = require('../service/userService.js');
const healthService = require('../service/healthService.js');
const createUser = async(request, response) => {
      response.set('Cache-Control', 'no-cache');

      try{
            const isDbHealthy = await healthService.checkDbHealth();
            console.log('DB Health from user controller: ' + isDbHealthy);
            if(!isDbHealthy){
                  return response.status(503).send();
            }
      }catch (error){
            console.log('Error while creating user: ', error);
            return response.status(503).send();
      }

      try{
            console.log('content type at user controller: ' + request.headers['content-type']);
            console.log('Request body from createUser controller: ', request.body);

            if(Object.keys(request.query).length > 0 || request.headers['content-type'] != 'application/json'){
                  console.log('Invalid request body for user controller create method');
                  return response.status(400).send(); //bad request
            }
            
            const {first_name, last_name, password, email, ...ignoredFields} = request.body;
            console.log('Email from createUser controller: ', email, ' first_name: ', first_name, ' last_name: ', last_name, ' password: ', password);

            const emailFormat = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            
            if (Object.keys(ignoredFields).length > 0) {
                  console.log('Invalid request body, ignored');
                  return response.status(400).send();
              }

            if(!email.match(emailFormat)){
                  console.log('Invalid email format');
                  return response.status(400).send(); //bad request
            }

            if (!email || !first_name || !last_name || !password) {
                  console.log("Invalid types");
                  return response.status(400).send(); //bad request
            }

            if(typeof email !== 'string' || typeof first_name !== 'string' || typeof last_name !== 'string' || typeof password !== 'string'){
                  console.log('Invalid request body for user controller create method');
                  return response.status(400).send(); //bad request
            }

            if(password.trim() === '' || password.length < 8){
                  console.log('Password length is smaller than 8 characters');
                  return response.status(400).send(); //bad request
            }
            
            const user = await userService.createUser(email, first_name, last_name, password);

            if(user === null){
                  console.log('User already exists');
                  return response.status(400).send(); //bad request
            }

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
            return response.status(503).send();
      }
}

const getUser = async(request, response) => {
      response.set('Cache-Control', 'no-cache');
      try{
            const isDbHealthy = await healthService.checkDbHealth();
            console.log('DB Health from user controller: ' + isDbHealthy);
            if(!isDbHealthy){
                  return response.status(503).send();
            }
      }catch (error){
            console.log('Error while getting user: ', error);
            return response.status(503).send();
      }

      try{
            //console.log('request body at user controller at get: ' + " " + request.headers['content-type']);
            const contentLength = request.headers['content-length'];
            if(Object.keys(request.body).length > 0  || Object.keys(request.query).length > 0 || (contentLength != undefined && contentLength > 0)){
                  console.log('Invalid request query for user controller get method' + request.headers['content-type']);
                  return response.status(400).send();
            }
            const username = request.authenticatedUser.username;
            //const password = request.authenticatedUser.password;
            console.log('Username from getUser controller: ', username);
            const user = await userService.getUser(username);

            if(user === null){
                  console.log('User not found');
                  return response.status(403).send(); //user not authenticated and not found
            }

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
            return response.status(503).send();
      }
}

const updateUser = async(request, response) => {
      response.set('Cache-Control', 'no-cache');
      try{
            const isDbHealthy = await healthService.checkDbHealth();
            console.log('DB Health from user controller: ' + isDbHealthy);
            if(!isDbHealthy){
                  return response.status(503).send();
            }
      }catch (error){
            console.log('Error while getting user: ', error);
            return response.status(503).send();
      }

      try{
            if(Object.keys(request.query).length > 0 || request.headers['content-type'] != 'application/json'){
                  console.log('Invalid request body for user controller update method');
                  return response.status(400).send();
            }

            const { first_name, last_name, password, email, ...ignoredFields} = request.body;
            console.log('Request body from updateUser controller');
            console.log('first_name: ', first_name, ' last_name: ', last_name, ' password: ', password, ' email: ', email);

            const emailFormat = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

            if(Object.keys(ignoredFields).length > 0){
                  console.log('Invalid request body, ignored at update');
                  return response.status(400).send();
            }

            if(!first_name || !last_name || !password || !email){
                  console.log('Invalid request body for user controller update method');
                  return response.status(400).send();
            }     

            if(typeof first_name !== 'string' || typeof last_name !== 'string' || typeof password !== 'string' || typeof email !== 'string'){
                  console.log('Invalid attribute types user controller update method');
                  return response.status(400).send();
            }

            if(password.trim() === '' || password.length < 8){
                  console.log('Password length is smaller than 8 characters');
                  return response.status(400).send();
            }

            if(!email.match(emailFormat)){
                  console.log('Invalid email format');
                  return response.status(400).send();
            }

            const username = request.authenticatedUser.username;

            if(username !== email){
                  console.log('Username and email do not match');
                  return response.status(400).send();
            }
            
            console.log('Username from updateUser controller: ', username);

            const user = await userService.updateUser(username, first_name, last_name, password);

            if(!user){
                  console.log('User not found');
                  return response.status(403).send();
            }

            return response.status(204).send();
      } catch(error){
            console.log('Error while updating user: ', error);
            return response.status(503).send();
      }

};

module.exports = { createUser, getUser, updateUser };