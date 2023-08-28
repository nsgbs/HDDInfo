const express = require('express');
const app = express();
const fs = require('fs');
const { promisify } = require('util');
const XmlReader = require('xml-reader');
const pathXml = (__dirname + '/report.xml');
const xmlQuery = require('xml-query');
const fs1 = require('fs').promises;
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const exec = promisify(require('child_process').exec);
const bodyParser = require('body-parser');
let systemConfig = {};

app.use(bodyParser.json());
app.use(express.static('public'));

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

app.get('/api/getLastInfo', (req, res) => {
  console.log("parsedLastInfo");
  getLastInfoHDDs().then(parsedInfo => {
    res.send(parsedInfo)
  });
});

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


app.post('/api/saveConfig', (req, res) => {
  (async function() {
    await saveConfig(req.body);
  })();
  

});

app.on('configLoaded', () => {
  app.listen(3000, () => {
    console.log("server exec on port 3000");
  })
});



async function getInfoHDDs() {
  try {
    const { stdout, stderr } = await exec(__dirname + '/HDSentinel -xml -dump', { encoding: "UTF-8" });
    let data = stdout;
    let parsedInfo = {};
    xmlQuery(XmlReader.parseSync(data)).find("Application_Information").children().each(node => {
      parsedInfo[node.name] = xmlQuery(node).children().text();
    });
    xmlQuery(XmlReader.parseSync(data)).find("Computer_Information").children().each(node => {
      parsedInfo[node.name] = xmlQuery(node).children().text();
    });
    //get hdds quantity
    parsedInfo.HDDQUANTITY = xmlQuery(XmlReader.parseSync(data)).find("Hard_Disk_Sentinel").children().size() - 2;
    for (let i = 0; i < parsedInfo.HDDQUANTITY; i++) {
      parsedInfo["Physical_Disk_Information_Disk_" + i] = {};
      xmlQuery(XmlReader.parseSync(data)).find("Physical_Disk_Information_Disk_" + i).children().each(node => {
        //creating indexes
        parsedInfo["Physical_Disk_Information_Disk_" + i][node.name] = {};
        xmlQuery(node).children().each(subnode => {
          parsedInfo["Physical_Disk_Information_Disk_" + i][node.name][subnode.name] = xmlQuery(subnode).children().text();
        })
      });
    };
    return parsedInfo;
  } catch (e) {
    console.error(e); // should contain code (exit code) and signal (that caused the termination).
  }
}

//use this function to simulate executing HDSentinel binaries for develop/debug
//to use this function, generate a .xml report on HDSentinel using -xml option
async function getInfoHDDsDEBUG() {
  let parsedInfo = {};
  const data = await readFileAsync(pathXml, 'utf-8');
    xmlQuery(XmlReader.parseSync(data)).find("Application_Information").children().each(node => {
      parsedInfo[node.name] = xmlQuery(node).children().text();
    });
    xmlQuery(XmlReader.parseSync(data)).find("Computer_Information").children().each(node => {
      parsedInfo[node.name] = xmlQuery(node).children().text();
    });
    //get hdds quantity
    parsedInfo.HDDQUANTITY = xmlQuery(XmlReader.parseSync(data)).find("Hard_Disk_Sentinel").children().size() - 2;
    for (let i = 0; i < parsedInfo.HDDQUANTITY; i++) {
      parsedInfo["Physical_Disk_Information_Disk_" + i] = {};
      xmlQuery(XmlReader.parseSync(data)).find("Physical_Disk_Information_Disk_" + i).children().each(node => {
        //creating indexes
        parsedInfo["Physical_Disk_Information_Disk_" + i][node.name] = {};
        xmlQuery(node).children().each(subnode => {
          parsedInfo["Physical_Disk_Information_Disk_" + i][node.name][subnode.name] = xmlQuery(subnode).children().text();
        })
      });
    }
  return parsedInfo;
}

(async() => {
  systemConfig = await loadConfig();
  app.emit('configLoaded');
})();

