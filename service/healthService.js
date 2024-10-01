const { sequelize } = require('../config/db.config.js');

const checkDbHealth = async() => {
      try {
            await sequelize.authenticate();
            console.log('Connection to the database is succesful');
            return true;
      }catch(error){
            console.log('Connection to the database was unsuccesful' + error);
            return false;
      }
};

module.exports = { checkDbHealth };