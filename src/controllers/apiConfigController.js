exports.configInfo = (req, res) => {
    const configToSend = req.query.configParameter;
    res.send(systemConfig[configToSend]);
};

exports.getLastInfo = (req, res) => {
    getLastInfoHDDs().then(parsedInfo => {
        res.send(parsedInfo)
      });
};

exports.saveConfig = (req, res) => {
    (async function() {
        await saveConfig(req.body);
      })();
};