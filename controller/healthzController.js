const healthService = require('../service/healthService.js');

const healthCheck = async(request, response) => {
      response.set('Cache-Control', 'no-cache');

      const contentLength = request.headers['content-length'];
      console.log('Content-Length: ' + contentLength);
      if(Object.keys(request.body).length > 0 || Object.keys(request.query).length > 0 || (contentLength != undefined && contentLength > 0)){
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


module.exports = { healthCheck };