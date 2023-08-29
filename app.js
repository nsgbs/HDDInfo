const express = require('express');
const app = express();
const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const bodyParser = require('body-parser');
let systemConfig = {};
const routes = require('./routes')
const path = require('path');


app.use(bodyParser.json());
app.use(express.static('public'));
app.use(routes);
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');


/*
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/api/configInfo', (req, res) => {
  const configToSend = req.query.configParameter;
  res.send(systemConfig[configToSend]);
});

app.get('/config', (req, res) => {
  res.sendFile(__dirname + '/config.html');
});

app.get('/getNewInfo', (req, res) => {
  console.log("parsedInfo");
  getInfoHDDsDEBUG().then(parsedInfo => {
    saveInfoHDDs(parsedInfo);
    res.send(parsedInfo);
  });
});
*/
async function saveInfoHDDs(data){
  writeFileAsync(`${__dirname}/lastInfo.json`,JSON.stringify(data),{encoding: 'utf8'});
};

async function getLastInfoHDDs(){
  let lastInfo;
  try{
    lastInfo = await readFileAsync(`${__dirname}/lastInfo.json`, {encoding: 'utf8'});
    lastInfo = JSON.parse(lastInfo);
  }
  catch{
    lastInfo = {}
  }
  return lastInfo;
};
/*
app.get('/api/getLastInfo', (req, res) => {
  console.log("parsedLastInfo");
  getLastInfoHDDs().then(parsedInfo => {
    res.send(parsedInfo)
  });
});
*/

async function loadConfig(){
  let parsedConfigFile;
  try{
    const configFile = await readFileAsync(`${__dirname}/config.json`, {encoding: 'utf8'});
    parsedConfigFile = JSON.parse(configFile);
  }
  catch(e){
    if(e.code === 'ENOENT'){
      parsedConfigFile = {'creationDate': Date.now()};
    } else {
      console.error('Loading config error. Blank config loaded instead.');
      console.error(e);
      parsedConfigFile = {'creationDate': Date.now()};
    }
  }
  return parsedConfigFile;
}

async function saveConfig(config){
  let jsonConfig = await loadConfig();
  jsonConfig[Object.entries(config)[0][0]] = Object.entries(config)[0][1]
  systemConfig[Object.entries(config)[0][0]] = Object.entries(config)[0][1]
  await writeFileAsync(`${__dirname}/config.json`,JSON.stringify(jsonConfig),{encoding: 'utf8'});
}

/*
app.post('/api/saveConfig', (req, res) => {
  (async function() {
    await saveConfig(req.body);
  })();
  
});
*/


app.on('configLoaded', () => {
  app.listen(3000, () => {
    console.log("server exec on port 3000");
  })
});



(async() => {
  systemConfig = await loadConfig();
  app.emit('configLoaded');
})();

