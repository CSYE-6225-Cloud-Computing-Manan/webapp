const express = require('express');
const router = express.Router();
const healthController = require('../controller/healthzController.js');

console.log('healthzRoutes.js');
router.get('/', healthController.healthCheck); //for the get request

router.all('/', healthController.otherHttpsHealthCheck); //rest https methods

module.exports = router;