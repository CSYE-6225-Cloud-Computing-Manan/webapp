const express = require('express');
const router = express.Router();
const userController = require('../controller/userController.js');
const authMiddleware = require('../middleware/authenticateBasic.js');

console.log("In userRoutes.js");

router.use('/', (request, response, next) => {
  const method = request.method;
  const path = request.path;

  if (method !== 'GET' && method !== 'POST' && method !== 'PUT') {
    response.set('Cache-Control', 'no-cache');
    console.log('Wrong HTTPS method used in user routes');
    return response.status(405).send();
  }

  if (method === 'POST' && path !== '/') {
    console.log('POST request beyond "/" is not allowed');
    return response.status(404).send();
  }

  if ((method === 'GET' || method === 'PUT') && path !== '/self') {
    console.log(`${method} request beyond '/self' is not allowed`);
    return response.status(404).send();
  }

  next();
});

router.post('/', userController.createUser);
router.get('/self', authMiddleware, userController.getUser);
router.put('/self', authMiddleware, userController.updateUser);

module.exports = router;