const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes')
const path = require('path');
const configManager = require('./src/utils/configManager');

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(routes);
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.on('configLoaded', () => {
  app.listen(3000, () => {
    console.log("server exec on port 3000");
  })
});

(async () => {
  configManager.systemConfig = await configManager.loadConfig();
  app.emit('configLoaded');
})();

