const express = require('express');
const router = express.Router();
const userController = require('../controller/userController.js');
const authMiddleware = require('../middleware/authenticateBasic.js');

console.log("In userRoutes.js");

router.use('/', (request, response, next) => {
  const method = request.method;
  const path = request.path;

  if (path === '/' && method !== 'POST') {
    console.log('Only POST method is allowed on "/"');
    return response.status(405).send();
  }

  if (path !== '/' && method === 'POST') {
    console.log('POST request beyond "/" is not allowed');
    return response.status(404).send();
  }

  if (path !== '/' && method !== 'POST') {
    console.log('Method not allowed for non-root paths');
    return response.status(405).send();
  }

  if (path === '/self' && method !== 'GET' && method !== 'PUT') {
    console.log(`Method ${method} is not allowed on "/self"`);
    return response.status(405).send();
  }

  if (path !== '/self' && (method === 'GET' || method === 'PUT')) {
    console.log(`${method} request beyond '/self' is not allowed`);
    return response.status(404).send();
  }

  next();
});

router.post('/', userController.createUser);
router.get('/self', authMiddleware, userController.getUser);
router.put('/self', authMiddleware, userController.updateUser);

module.exports = router;