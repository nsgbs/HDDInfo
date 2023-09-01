const getInfoHDDs = require('./../../hddInfo');

exports.mainPage = (req, res) => {
    //res.sendFile(__dirname + '/../../index.html');
    const datasend = { data: 'teste'}
    res.render('index', datasend);
};

exports.newInfo = (req, res) => {
    getInfoHDDs.getInfoHDDsDEBUG().then(parsedInfo => {
        getInfoHDDs.saveInfoHDDs(parsedInfo);
        res.send(parsedInfo);
    });
};