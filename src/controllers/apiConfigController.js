const configManager = require('./../../configManager');

exports.configInfo = (req, res) => {
    const sysConf = configManager.systemConfig;
    const configToSend = req.query.configParameter;
    res.send(sysConf[configToSend]);
};

exports.getLastInfo = (req, res) => {
    getLastInfoHDDs().then(parsedInfo => {
        res.send(parsedInfo)
      });
};

exports.saveConfig = (req, res) => {
    (async function() {
        await configManager.saveConfig(req.body);
      })();
};