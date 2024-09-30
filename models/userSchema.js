const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config.js');

const User = sequelize.define('User', {
      id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            readOnly: true,
      },
      first_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                  notEmpty: {
                        msg: 'First name is required'
                  }
            },
      },
      last_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                  notEmpty: {
                        msg: 'Last name is required'
                  }
            },
      },
      email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                  msg:" Email should be unique "
              },
            validate: {
                  isEmail: true,
                  notEmpty: {
                        msg: 'Email is required'
                  }
            },
      },
      password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                  notEmpty: {
                        msg: 'Password is required'
                  },
                  noSpaces(value) {
                        if (value.trim() === '') {
                          throw new Error('Password cannot be only spaces');
                        }
                  },
            },
      },
      account_created: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
      },    
      account_updated: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
      },
      timestamps: false,

});

module.exports = User;