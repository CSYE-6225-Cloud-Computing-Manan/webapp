const express = require('express');
const router = express.Router();

console.log("In userRoutes.js");

router.use('/', (request, response, next) => {
  if(request.method !== 'GET' && request.method !== 'POST' && request.method !== 'PUT'){
    response.set('Cache-Control', 'no-cache');
    console.log('Wrong HTTPS method used in user routes');
    return response.status(405).send();
  }
  next();
});

router.post();
router.get(); // parameterized
router.put(); // parameterized

