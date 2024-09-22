const express = require('express');
const router = express.Router();
const healthRoutes = require('./healthzRoutes.js');

console.log('index.js routes');

router.use('/healthz', healthRoutes);

router.all('/', (request, response) => {
      response.status(404).send();
});

module.exports = router;
