exports.mainPage = (req, res) => {
    res.sendFile(__dirname + '/config.html');
};