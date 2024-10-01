const express = require('express');
const routes = require('./routes/index.js');
const sequelize = require('./config/db.config.js');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(routes);

//console.log(sequelize);

app.listen(port, async () => {
      try{
            await sequelize.bootstrapConnection();
            console.log('Connection to the database and insync established successfully from index.js.');
            console.log(`Server is running on port ${port}`);
      } catch( error ){
            console.log('Error while bootstrapping the database from index.js: ', error);
            return error;
      }
})

module.exports = app;