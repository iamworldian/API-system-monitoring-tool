// Dependencies
const http = require('http');
const { handleRequest } = require('../helper/handler');
const ENV = require('../helper/environment');
// Module Scaffold Object
const server = {};

server.config = {
    host: 'localhost',
    port: 8000,
};

// Server Creation
server.createServer = () => {
    const serverStart = http.createServer(handleRequest);
    serverStart.listen(server.config.port, server.config.host, () => {
        // console.log(typeof process.env.DEV_ENV);
        console.log(`Server listening on ${server.config.host}:${ENV.port} in ${ENV.name}`);
    });
};
// Exec Module Server
server.init = () => {
    server.createServer();
};

module.exports = server;
