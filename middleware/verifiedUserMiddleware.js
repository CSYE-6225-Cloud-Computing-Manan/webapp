const userService = require('../service/userService.js');
const User = require('../models/userSchema.js');
const logger = require('../utils/logger.js');

const requireVerifiedUser = async (request, response, next) => {
      logger.info('Verifying user account');
      const user = await User.findOne({
            where: {
                  id: request.authenticatedUser.Id
            }
      });

      if(!user){
              logger.error('User not found');
              return response.status(400).send({ message: "User not found." });
      }

      if (!user.isVerifiedAccount) {
            logger.error('Account verification required, user not verified');
            return response.status(403).send({ message: "Account verification required." });
      }
  
      next();
  };

  module.exports = requireVerifiedUser;