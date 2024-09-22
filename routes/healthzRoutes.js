const express = require(express);
const router = express.Router();
const healthController = require('../controller/healthzController.js');


router.get('healtz', healthController.healthCheck); //for the get request

router.all('healthz', healthController.otherHttpsHealthCheck); //rest https methods