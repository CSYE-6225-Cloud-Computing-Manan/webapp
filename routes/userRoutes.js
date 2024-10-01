const express = require('express');
const router = express.Router();
const userController = require('../controller/userController.js');
const authMiddleware = require('../middleware/authenticateBasic.js');

console.log("In userRoutes.js");

router.use('/', (request, response, next) => {
  if(request.method !== 'GET' && request.method !== 'POST' && request.method !== 'PUT'){
    response.set('Cache-Control', 'no-cache');
    console.log('Wrong HTTPS method used in user routes');
    return response.status(405).send();
  }
  next();
});

router.post('/', userController.createUser);
router.get('/self', authMiddleware, userController.getUser);
router.put('/self', authMiddleware, userController.updateUser);

module.exports = router;