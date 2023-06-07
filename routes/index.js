const express = require('express');

const app = express();

app.use('/', require('./misc'));
app.use('/auth', require('./auth'));
app.use('/quotes', require('./quotes'));
app.use('/orders', require('./orders'));

module.exports = app;
