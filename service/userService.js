const User = require('../models/userSchema.js');
const bcrypt = require('bcrypt');

const createUser = async(email, first_name, last_name, password) => {
      try{
            const existingUser = await User.findOne({ where: {
                  email: email
            }});
            if(existingUser){
                  return null;
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const user = await User.create({
                  email: email,
                  first_name: first_name,
                  last_name: last_name,
                  password: hashedPassword
            });

            if(!user){
                  return null;
            }

            return user;
      }catch(error){
            console.log('Error while creating user: ', error);
            return null;
      }
};

const getUser = async(username) => {
      try{
            const user = await User.findOne({ where: {
                  email: username
            }
      });

            if(!user){
                  return null;
            }

            return user;
      }catch(error){
            console.log('Error while getting user: ', error);
            return null;
      }
};

const updateUser = async(username, first_name, last_name, password) => {
      try{
            const user = await User.findOne({ where: {
                  email: username
            }});

            if(!user){
                  return null;
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.first_name = first_name;
            user.last_name = last_name;
            user.password = hashedPassword;
            await user.save();

            return user;
      }catch(error){
            console.log('Error while updating user: ', error);
            return null;
      }
};

module.exports = { createUser, getUser, updateUser };