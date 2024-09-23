const healthService = require('../service/healthService.js');

const healthCheck = async(request, response) => {
      response.set('Cache-Control', 'no-cache');
      
      if(Object.keys(request.body).length > 0){
            return response.status(400).send();
      }

      const dbHealth = await healthService.checkDbHealth();

      console.log('DB Health from controller: ' + dbHealth);

      if(dbHealth){
            return response.status(200).send();
      }else{
            return response.status(503).send();
      }
}

const otherHttpsHealthCheck = async(request, response) => {

      console.log('Wrong HTTPS method used');

      return response.status(405).send();
}

module.exports = { healthCheck, otherHttpsHealthCheck };