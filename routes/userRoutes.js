const express = require('express');
const router = express.Router();
const userController = require('../controller/userController.js');
const authMiddleware = require('../middleware/authenticateBasic.js');
const verifiedUserMiddleware = require('../middleware/verifiedUserMiddleware.js');
const multer = require('multer');
const upload = multer({ dest: __dirname + '/uploads/' });

console.log("In userRoutes.js");

// Middleware for method restrictions
router.use((request, response, next) => {
  const method = request.method;
  const path = request.path;

  // Allow only POST on the root path ('/')
  if (path === '/' && method !== 'POST') {
    console.log('Only POST method is allowed on "/"');
    return response.status(405).send('Method Not Allowed');
  }

  // Allow only GET on '/verify'
  else if (path === '/verify' && method !== 'GET') {
    console.log('Only GET method is allowed on "/verify"');
    return response.status(405).send('Method Not Allowed');
  }

  // Allow only GET and PUT on '/self'
  else if (path === '/self' && method !== 'GET' && method !== 'PUT') {
    console.log(`Method ${method} is not allowed on "/self"`);
    return response.status(405).send('Method Not Allowed');
  }
  // Allow only POST, GET, and DELETE on '/self/pic'
  else if (path === '/self/pic' && method !== 'POST' && method !== 'GET' && method !== 'DELETE') {
    console.log(`Method ${method} is not allowed on "/self/pic"`);
    return response.status(405).send('Method Not Allowed');
  }
  // If the path doesn't match any of the defined routes
  else if (path !== '/' && path !== '/verify' && path !== '/self' && path !== '/self/pic') {
    console.log("Invalid request path");
    return response.status(404).send('Not Found');
  }

  // If the request passes all conditions, move to the next handler
  next();
});


// Route handlers
router.post('/', userController.createUser);
router.get('/verify', userController.verifyUser);
router.get('/self', authMiddleware, verifiedUserMiddleware, userController.getUser);
router.put('/self', authMiddleware, verifiedUserMiddleware, userController.updateUser);
router.post('/self/pic', authMiddleware, verifiedUserMiddleware, upload.single('profilePic'), userController.uploadProfilePic);
router.get('/self/pic', authMiddleware, verifiedUserMiddleware, userController.getProfilePic);
router.delete('/self/pic', authMiddleware, verifiedUserMiddleware, userController.deleteProfilePic);

module.exports = router;
