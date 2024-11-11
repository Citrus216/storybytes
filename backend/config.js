let runType = null;

function getRunType() {
    return runType;
}

function setRunType(type) {
    runType = type;
}

// Middleware to check if run type is set
function checkRunType(req, res, next) {
    if (!runType) {
        return res.status(403).send('Run type not set. Please restart the server and set a run type.');
    }
    req.runType = runType;
    next();
}

module.exports = {
    getRunType,
    setRunType,
    checkRunType,
};