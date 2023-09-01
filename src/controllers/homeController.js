const getInfoHDDs = require('./../utils/hddInfo');

exports.mainPage = (req, res) => {
    res.render('index');
};

exports.newInfo = (req, res) => {
    getInfoHDDs.getInfoHDDs().then(parsedInfo => {
        getInfoHDDs.saveInfoHDDs(parsedInfo);
        res.send(parsedInfo);
    });
};