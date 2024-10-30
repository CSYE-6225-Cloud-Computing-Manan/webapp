const { sequelize } = require('../config/db.config.js');
const logger = require('../utils/logger.js');
const client = require('../middleware/statsD.js');

const checkDbHealth = async() => {
      const startTime = Date.now();
      try {
            await sequelize.authenticate();
            console.log('Connection to the database is succesful');
            logger.info('Connection to the database is succesful');
            const duration = Date.now() - startTime;
            client.timing('db.health', duration);
            return true;
      }catch(error){
            logger.error('Connection to the database was unsuccesful' + error);
            console.log('Connection to the database was unsuccesful' + error);
            const duration = Date.now() - startTime;
            client.timing('db.health', duration);
            return false;
      }
};

module.exports = { checkDbHealth };