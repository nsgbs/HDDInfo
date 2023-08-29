const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController.js');
const configController = require('./src/controllers/configController.js');
const apiConfigController = require('./src/controllers/apiConfigController.js');

route.get('/', homeController.mainPage);

route.get('/getNewInfo', homeController.newInfo);

route.get('/config', configController.mainPage);

route.get('/api/configInfo', apiConfigController.configInfo);

route.get('/api/getLastInfo',apiConfigController.getLastInfo);

route.post('/api/saveConfig',apiConfigController.saveConfig);


module.exports = route;