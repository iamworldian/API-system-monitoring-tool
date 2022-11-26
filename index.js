// Dependencies
const http = require('http');
const worker = require('./lib/worker');
const server = require('./lib/server');
const crud = require('./lib/data');
// Module Scaffold Object
const app = {};
// Server Creation
app.createServer = () => {
    worker.init();
    server.init();
};
// Exec Module Server
app.createServer();

// create test
// crud.create('test', 'test.json', '{"name" : "ashik"}', (err) => {
//     console.error(err);
// });

// read test
// crud.read('test', 'test.json', (err, data) => {
//     console.log(err, data.toString());
// });

// update test
// crud.update('test', 'test.json', '{"name" : "someone"}', (err) => {
//     console.error(err);
// });

// Delete test
// crud.delete('test', 'test.json', (err) => {
//     console.log(err);
// });

// crud.ls('tokens', (err, files) => {
//     console.log(files);
// });
