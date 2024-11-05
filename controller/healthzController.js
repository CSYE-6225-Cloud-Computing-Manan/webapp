const healthService = require('../service/healthService.js');
const logger = require('../utils/logger.js');
const client = require('../middleware/statsD.js');
const { log } = require('util');

const healthCheck = async(request, response) => {
      const startTime = Date.now();
      response.set('Cache-Control', 'no-cache');
      client.increment('healthCheck.get');
      const contentLength = request.headers['content-length'];
      console.log('Content-Length: ' + contentLength);
      if(Object.keys(request.body).length > 0 || Object.keys(request.query).length > 0 || (contentLength != undefined && contentLength > 0)){
            logger.error('Invalid request from healthCheck controller');
            const duration = Date.now() - startTime;
            client.timing('healthCheck.get', duration);
            return response.status(400).send();
      }

      const dbHealth = await healthService.checkDbHealth();

      console.log('DB Health from controller: ' + dbHealth);

      if(dbHealth){
            logger.info('Health check successful from healthCheck controller');
            const duration = Date.now() - startTime;
            client.timing('healthCheck.get', duration);
            return response.status(200).send();
      }else{
            logger.error('Health check failed from healthCheck controller');
            const duration = Date.now() - startTime;
            client.timing('healthCheck.get', duration);
            return response.status(503).send();
      }
}


module.exports = { healthCheck };