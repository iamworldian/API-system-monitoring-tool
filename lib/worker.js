// Dependencies

const { Http2ServerRequest } = require('http2');
const { check } = require('prettier');
const http = require('http');
const https = require('https');
const url = require('url');
const { parseJSON } = require('../helper/utilities');
const crud = require('./data');
// Module Scaffold Object
const worker = {};
worker.performCheckData = (checkData) => {
    const parsedUrl = url.parse(`${checkData.protocol}://${checkData.url}`, true);
    const hostName = parsedUrl.hostname;
    const { path } = parsedUrl;

    const requestProperties = {
        protocol: `${checkData.protocol}:`,
        hostName,
        method: checkData.method.toUpperCase(),
        timeout: checkData.timeOutSeconds * 1000,
    };

    const protocolToUse = checkData.protocol === 'http' ? http : https;

    let req = protocolToUse.request(requestProperties , (res) => {
        const status = res.status;
    });

    
};
worker.validateCheckData = (checkObject) => {
    const checkData = checkObject;

    checkData.state =
        typeof checkObject.state === 'string' && ['up', 'down'].indexOf(checkObject.state) > -1
            ? checkObject.state
            : 'down';

    checkData.lastChecked =
        typeof checkObject.lastChecked === 'number' ? checkObject.lastChecked : false;

    worker.performCheck(checkData);
};
worker.gatherAllChecks = () => {
    crud.ls('checks', (errOnlistingChecks, files) => {
        if (!errOnlistingChecks) {
            files.forEach((element) => {
                crud.read('checks', element, (errOnReadingChecks, checkObject) => {
                    if (!errOnReadingChecks) {
                        worker.validateCheckData(parseJSON(checkObject));
                    } else {
                        console.log(errOnReadingChecks);
                    }
                });
            });
        } else {
            console.log(errOnlistingChecks);
        }
    });
};

worker.loop = () => {
    setInterval(() => {
        worker.gatherAllChecks();
    }, 1000 * 10);
};
// Server Creation
worker.init = () => {
    // worker.loop();
};
// Exec Module Server
module.exports = worker;
