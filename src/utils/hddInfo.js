const fs = require('fs');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const XmlReader = require('xml-reader');
// const pathXml = (__dirname + '/report.xml');
const xmlQuery = require('xml-query');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

exports.saveInfoHDDs = async function (data) {
    writeFileAsync(`${__dirname}/lastInfo.json`, JSON.stringify(data), { encoding: 'utf8' });
};

exports.getInfoHDDs = async function () {
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
        console.error(e);
        parsedInfo = {error: "Error retrieving data from HDSentinel. Are you running root?"};
        return parsedInfo;
    }
}

//use this function to simulate executing HDSentinel binaries for develop/debug
//to use this function, generate a .xml report on HDSentinel using -xml option
// exports.getInfoHDDsDEBUG = async function () {
//     let parsedInfo = {};
//     const data = await readFileAsync(pathXml, 'utf-8');
//     xmlQuery(XmlReader.parseSync(data)).find("Application_Information").children().each(node => {
//         parsedInfo[node.name] = xmlQuery(node).children().text();
//     });
//     xmlQuery(XmlReader.parseSync(data)).find("Computer_Information").children().each(node => {
//         parsedInfo[node.name] = xmlQuery(node).children().text();
//     });
//     //get hdds quantity
//     parsedInfo.HDDQUANTITY = xmlQuery(XmlReader.parseSync(data)).find("Hard_Disk_Sentinel").children().size() - 2;
//     for (let i = 0; i < parsedInfo.HDDQUANTITY; i++) {
//         parsedInfo["Physical_Disk_Information_Disk_" + i] = {};
//         xmlQuery(XmlReader.parseSync(data)).find("Physical_Disk_Information_Disk_" + i).children().each(node => {
//             //creating indexes
//             parsedInfo["Physical_Disk_Information_Disk_" + i][node.name] = {};
//             xmlQuery(node).children().each(subnode => {
//                 parsedInfo["Physical_Disk_Information_Disk_" + i][node.name][subnode.name] = xmlQuery(subnode).children().text();
//             })
//         });
//     }
//     return parsedInfo;
// }

exports.getLastInfoHDDs = async function (){
    let lastInfo;
    try{
      lastInfo = await readFileAsync(`${__dirname}/lastInfo.json`, {encoding: 'utf8'});
      lastInfo = JSON.parse(lastInfo);
      delete lastInfo.error;
    }
    catch{
      lastInfo = {}
    }
    return lastInfo;
  };