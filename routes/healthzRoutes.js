const express = require('express');
const router = express.Router();
const healthController = require('../controller/healthzController.js');

console.log('healthzRoutes.js');

router.use('/', (request, response, next) => {
      if(request.method !== 'GET' || request.path !== '/') {
            response.set('Cache-Control', 'no-cache');
            console.log('Wrong HTTPS method used');
            return response.status(405).send();
      }
      next();
});

router.get('/', healthController.healthCheck); //for the get request



module.exports = router;