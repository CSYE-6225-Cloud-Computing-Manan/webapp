const express = require('express');
const router = express.Router();
const healthRoutes = require('./healthzRoutes.js');
const userRoutes = require('./userRoutes.js');

console.log('index.js routes');

router.use('/healthz', healthRoutes);

router.use('/v1/user', userRoutes);

router.all('/', (request, response) => {
      response.status(404).send();
});

module.exports = router;
