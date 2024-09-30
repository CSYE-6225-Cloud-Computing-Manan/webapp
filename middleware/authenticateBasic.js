const bcrypt = require('bcrypt');
const { User } = require('../models/userSchema.js');

const userAuthencation = async (request, response, next) => {
      try{
            const userToken = request.headers.authorization;

            if (!userToken || userToken.indexOf('Basic ') === -1) {
                  return res.status(401).json({});
            }
            const base64Creds =  userToken.split(' ')[1];
            const [username, password] = Buffer.from(base64Credentials, 'base64').toString('utf-8').split(':'); //token format- "username:password"

            const user = await User.findOne({ where: { email: username } });
      
              if (!user || !(await bcrypt.compare(password, user.password))) {
                  return res.status(401).send({});
              }

              request.authenticatedUser = {
                  Id: user.id,
                  username: user.username
              };
              next();
      }catch (error) {
            console.log('Error while authenticating user: ', error);
            return response.status(503).send();
      }
}

module.exports = userAuthencation;