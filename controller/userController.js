const userService = require('../service/userService.js');
const healthService = require('../service/healthService.js');
const createUser = async(request, response) => {
      response.set('Cache-Control', 'no-cache');

      try{
            const isDbHealthy = await healthService.checkDbHealth();
            console.log('DB Health from user controller: ' + isDbHealthy);
      }catch (error){
            console.log('Error while creating user: ', error);
            return response.status(503).send();
      }

      try{
            if(Object.keys(request.body).length !== 4 || Object.keys(request.query).length > 0){
                  console.log('Invalid request body for user controller create method');
                  return response.status(400).send();
            }
            const { email, first_name, last_name, password } = request.body;
            const emailFormat = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if(!email.match(emailFormat)){
                  console.log('Invalid email format');
                  return response.status(400).send();
            }

            if (!email || !first_name || !last_name || !password) {
                  return res.status(400).send();
            }

            if(typeof email !== 'string' || typeof first_name !== 'string' || typeof last_name !== 'string' || typeof password !== 'string'){
                  console.log('Invalid request body for user controller create method');
                  return response.status(400).send();
            }

            if(password.trim() === '' || password.length < 8){
                  console.log('Password length is smaller than 8 characters');
                  return response.status(400).send();
            }
            
            const user = await userService.createUser(email, first_name, last_name, password);

            if(user === null){
                  console.log('User already exists');
                  return response.status(409).send();
            }

            return response.status(201).send(); //returning when user got created susccessfully
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
      }catch (error){
            console.log('Error while getting user: ', error);
            return response.status(503).send();
      }

      try{
            if(Object.keys(request.body).length > 0  || Object.keys(request.query).length > 0){
                  console.log('Invalid request query for user controller get method');
                  return response.status(400).send();
            }
            const username = request.authenticatedUser.username;
            const user = await userService.getUser(username);

            if(!user){
                  console.log('User not found');
                  return response.status(404).send();
            }

            return response.status(200).send(user);
            
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
      }catch (error){
            console.log('Error while getting user: ', error);
            return response.status(503).send();
      }

      try{
            if(Object.keys(request.body).length !== 3 || Object.keys(request.query).length > 0){
                  console.log('Invalid request body for user controller update method');
                  return response.status(400).send();
            }

            const { first_name, last_name, password } = request.body;

            if(!first_name || !last_name || !password){
                  console.log('Invalid request body for user controller update method');
                  return response.status(400).send();
            }     

            if(typeof first_name !== 'string' || typeof last_name !== 'string' || typeof password !== 'string'){
                  console.log('Invalid attribute types user controller update method');
                  return response.status(400).send();
            }

            if(password.trim() === '' || password.length < 8){
                  console.log('Password length is smaller than 8 characters');
                  return response.status(400).send();
            }

            const username = request.authenticatedUser.username;

            const user = await userService.updateUser(username, first_name, last_name, password);

            if(!user){
                  console.log('User not found');
                  return response.status(404).send();
            }

            return response.status(200).send();
      } catch(error){
            console.log('Error while updating user: ', error);
            return response.status(503).send();
      }

};

module.exports = { createUser, getUser, updateUser };