const userService = require('../service/userService.js');
const User = require('../models/userSchema.js');
const bcrypt = require('bcrypt');
const { sequelize } = require('../config/db.config.js');

jest.mock('../models/userSchema.js');
jest.mock('bcrypt');

beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('User Service', () => {
  
  describe('createUser', () => {
    it('should create a new user', async () => {
      const mockUser = { 
        id: 1, 
        email: 'test@example.com', 
        first_name: 'testF_Name', 
        last_name: 'testL_Name', 
        password: 'testUser12345',
        isVerifiedAccount: false,
        verificationToken: 'mock-token'
      };
      
      User.findOne.mockResolvedValue(null); // No existing user
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('testUser12345');
      User.create.mockResolvedValue(mockUser);

      const result = await userService.createUser(
        'test@example.com', 
        'testF_Name', 
        'testL_Name', 
        'testUser12345',
        'mock-token'  // Add verification token parameter
      );

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(bcrypt.hash).toHaveBeenCalledWith('testUser12345', 'salt');
      expect(User.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        first_name: 'testF_Name',
        last_name: 'testL_Name',
        password: 'testUser12345',
        isVerifiedAccount: false,
        verificationToken: 'mock-token'
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user already exists', async () => {
      User.findOne.mockResolvedValue({ email: 'test@example.com' });

      const result = await userService.createUser(
        'test@example.com', 
        'testF_Name', 
        'testL_Name', 
        'testUser12345',
        'mock-token'
      );

      expect(result).toBeNull();
    });

    it('should return null on error', async () => {
      User.findOne.mockRejectedValue(new Error('DB error'));

      const result = await userService.createUser(
        'test@example.com', 
        'testF_Name', 
        'testL_Name', 
        'testUser12345',
        'mock-token'
      );

      expect(result).toBeNull();
    });
  });

  describe('getUser', () => {
    it('should return user when found', async () => {
      const mockUser = { id: 1, email: 'test@example.com', first_name: 'testF_Name', last_name: 'testL_Name' };
      User.findOne.mockResolvedValue(mockUser);

      const result = await userService.getUser('test@example.com');

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      User.findOne.mockResolvedValue(null);

      const result = await userService.getUser('test@example.com');

      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user if found', async () => {
      const mockUser = { id: 1, email: 'test@example.com', first_name: 'OldFirst', last_name: 'OldLast', save: jest.fn() };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('newhashedpassword');

      const result = await userService.updateUser('test@example.com', 'NewFirst', 'NewLast', 'newpassword123');

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 'salt');
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      User.findOne.mockResolvedValue(null);

      const result = await userService.updateUser('test@example.com', 'NewFirst', 'NewLast', 'newpassword123');

      expect(result).toBeNull();
    });
  });
});