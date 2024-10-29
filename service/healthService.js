const { sequelize } = require('../config/db.config.js');
const logger = require('../utils/logger.js');

const checkDbHealth = async() => {
      try {
            await sequelize.authenticate();
            console.log('Connection to the database is succesful');
            logger.info('Connection to the database is succesful');
            return true;
      }catch(error){
            logger.error('Connection to the database was unsuccesful' + error);
            console.log('Connection to the database was unsuccesful' + error);
            return false;
      }
};

module.exports = { checkDbHealth };