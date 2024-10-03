const request = require('supertest');
const express = require('express');
const userController = require('../controller/userController.js');
const userService = require('../service/userService.js');
const healthService = require('../service/healthService.js');
const { sequelize } = require('../config/db.config.js');

jest.mock('../service/userService.js');
jest.mock('../service/healthService.js');

beforeAll(async () => {
      await sequelize.authenticate();
      await sequelize.sync({ force: true });
    });
    
    afterAll(async () => {
      await sequelize.close();
    });

const app = express();
app.use(express.json());
app.post('/v1/user', userController.createUser);
app.get('/v1/user/self', userController.getUser);
app.put('/v1/user/self', userController.updateUser);

describe('User Controller', () => {
  
  describe('POST /v1/user - createUser', () => {
    it('should return 200 when user is successfully created', async () => {
      healthService.checkDbHealth.mockResolvedValue(true);
      userService.createUser.mockResolvedValue({ email: 'test@example.com' });

      const response = await request(app)
        .post('/v1/user')
        .send({ email: 'test@example.com', first_name: 'testF_Name', last_name: 'testL_Name', password: 'testUser12345' })
        .set('Content-Type', 'application/json');

      expect(response.statusCode).toBe(201);
      expect(userService.createUser).toHaveBeenCalledWith('test@example.com', 'testF_Name', 'testL_Name', 'testUser12345');
    });

    it('should return 400 for bad request body', async () => {
      const response = await request(app)
        .post('/v1/user')
        .send({ email: 'test@example.com', first_name: 'testF_Name', last_name: 'testL_Name' }) // missing password
        .set('Content-Type', 'application/json');

      expect(response.statusCode).toBe(400);
    });

    it('should return 503 if DB is unhealthy', async () => {
      healthService.checkDbHealth.mockResolvedValue(false);

      const response = await request(app)
        .post('/v1/user')
        .send({ email: 'test@example.com', first_name: 'testF_Name', last_name: 'testL_Name', password: 'testUser12345' })
        .set('Content-Type', 'application/json');

      expect(response.statusCode).toBe(503);
    });
  });

    it('should return 503 if DB is unhealthy', async () => {
      healthService.checkDbHealth.mockResolvedValue(false);

      const response = await request(app)
        .put('/v1/user/self')
        .send({ first_name: 'testF_Name', last_name: 'testL_Name', password: 'testUser12345' })
        .set('authenticatedUser', { Id: 1, username: 'test@example.com' })
        .set('Content-Type', 'application/json');

      expect(response.statusCode).toBe(503);
    });
  });
