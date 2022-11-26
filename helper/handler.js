// Dependencies
const { StringDecoder } = require('string_decoder');
const url = require('url');
const { notFoundHandler } = require('./routeHandler/notFoundHandler');
const routes = require('../route');
const util = require('./utilities');
// handler Scaffold
const handler = {};

handler.handleRequest = (req, res) => {

    // Request URL

    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname.replace(/\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryString = parsedUrl.query;
    const headerObject = req.headers;

    const requestProperties = {
        parsedUrl,
        path,
        method,
        queryString,
        headerObject,
    };
    
    const choosenHandler = routes[path] ? routes[path] : notFoundHandler;

    const decoder = new StringDecoder('utf-8');
    let payload = '';

    req.on('data', (buffer) => {
        payload += decoder.write(buffer);
    });

    req.on('end', () => {
        payload += decoder.end();
        requestProperties.body = util.parseJSON(payload);
        choosenHandler(requestProperties, (statusCode, data) => {
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            //res.write(payload);
            res.write(JSON.stringify(data));
            res.end();
        });
    });
};

module.exports = handler;
