const bcrypt = require('bcrypt');
const User = require('../models/userSchema.js');

const userAuthencation = async (request, response, next) => {
      try{
            response.set('Cache-Control', 'no-cache');
            const userToken = request.headers.authorization;
            console.log('userToken: ', userToken);
            
            if (!userToken || userToken.indexOf('Basic ') === -1) {
                  return response.status(401).send();
            }

            console.log('request method ' + request.method);
            
            const base64Creds =  userToken.split(' ')[1];
            console.log('base64Creds', base64Creds);
            
            const [username, password] = Buffer.from(base64Creds, 'base64').toString('utf-8').split(':'); //token format- "username:password"
            console.log('username: ', username, " password: ", password);
            
            const user = await User.findOne({ 
                  where: { 
                        email: username
                  }
            });
      
              if (!user) {
                  return response.status(401).send();
              }else if(user && !(await bcrypt.compare(password, user.password))){
                  return response.status(401).send();
              }

              request.authenticatedUser = {
                  Id: user.id,
                  username: user.email
              };

              console.log(request.authenticatedUser);
              next();
      }catch (error) {
            console.log('Error while authenticating user: ', error);
            return response.status(503).send();
      }
}

module.exports = userAuthencation;