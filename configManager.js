const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

exports.loadConfig = async function () {
    let parsedConfigFile;
    try {
        const configFile = await readFileAsync(`${__dirname}/config.json`, { encoding: 'utf8' });
        parsedConfigFile = JSON.parse(configFile);
    }
    catch (e) {
        if (e.code === 'ENOENT') {
            parsedConfigFile = { 'creationDate': Date.now() };
        } else {
            console.error('Loading config error. Blank config loaded instead.');
            console.error(e);
            parsedConfigFile = { 'creationDate': Date.now() };
        }
    }
    return parsedConfigFile;
};

exports.saveConfig = async function (config) {
    let jsonConfig = await this.loadConfig();
    jsonConfig[Object.entries(config)[0][0]] = Object.entries(config)[0][1]
    systemConfig[Object.entries(config)[0][0]] = Object.entries(config)[0][1]
    await writeFileAsync(`${__dirname}/config.json`, JSON.stringify(jsonConfig), { encoding: 'utf8' });
};