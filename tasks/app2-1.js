const express = require('express');
const router = require('../tasks/routes/users.js');

const app = express();

app.listen(3000);
app.use(express.json());

app.use('/users/', router);
