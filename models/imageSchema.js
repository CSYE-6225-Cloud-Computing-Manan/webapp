const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config.js');

const Image = sequelize.define('Image', {
      file_name: {
            type: DataTypes.STRING,
            allowNull: false,
            readOnly: true,
            validate: {
                  notEmpty: {
                        msg: 'File name is required'
                  }
            },
      },
      id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            readOnly: true,
      },
      url: {
            type: DataTypes.STRING,
            allowNull: false,
            readOnly: true,
            validate: {
                  notEmpty: {
                        msg: 'URL is required'
                  }
            },
      },
      upload_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
            readOnly: true,
            // get() {
            //       // Format the date to 'YYYY-MM-DD'
            //       const rawDate = this.getDataValue('upload_date');
            //       return rawDate ? rawDate.toISOString().split('T')[0] : null;
            // }
      },
      user_id: {
            type: DataTypes.UUID,
            foreignKey: true,
            allowNull: false,
            readOnly: true,
      },
});