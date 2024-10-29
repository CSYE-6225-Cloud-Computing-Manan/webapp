const winston = require('winston');
const appRoot = require('app-root-path');
const { createLogger, transports, format } = require('winston');
const logger = winston.createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.printf((info) =>
          JSON.stringify({
              timestamp: info.timestamp,
              level: info.level,
              message: info.message,
          })
      )
  ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: appRoot + "/logs/csye-6225.log",
          })
        ],
})

module.exports = logger;