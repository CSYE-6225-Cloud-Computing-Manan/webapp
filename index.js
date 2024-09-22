const express = require('express');
const routes = require('./routes/index.js');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(routes);

app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
})

module.exports = app;