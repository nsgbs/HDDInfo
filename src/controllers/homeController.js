const getInfoHDDs = require('./../../hddInfo');

exports.mainPage = (req, res) => {
    //res.sendFile(__dirname + '/../../index.html');
    res.render('index')
};

exports.newInfo = (req, res) => {
    getInfoHDDs.getInfoHDDsDEBUG().then(parsedInfo => {
        getInfoHDDs.saveInfoHDDs(parsedInfo);
        res.send(parsedInfo);
    });
};