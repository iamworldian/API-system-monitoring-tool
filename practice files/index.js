/*
//Serving text output

const http = require('http');

const host = 'localhost';
const port = 8080;

const requestListener = function (req, res) {
    res.writeHead(400);
    res.end('My first server!');
};

const server = http.createServer(requestListener);

server.listen(port , host , () => {
    console.log(`Server is running on http://${host}:${port}`);
});
*/
/*
// Serving JSON
const http = require('http');

const host = 'localhost';
const port = 8080;

const requestListener = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    console.log(JSON.parse('{"message": "This is a JSON response 2"}').message);
    res.end('{"message": "This is a JSON response 2"}');
};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
*/
/*
// Serving JSON
const http = require('http');

const host = 'localhost';
const port = 8080;

const requestListener = (req, res) => {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment;filename=oceanpals.csv');
    res.writeHead(200);
    res.end('id,name,email\n1,Sammy Shark,shark@ocean.com');
};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

*/

/*
// serving HTML

const http = require('http');

const host = 'localhost';
const port = 8000;

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    res.end('<html><body><h1>This is HTML</h1></body></html>');
});

server.listen(port, host, () => {
    console.log(`Server Listening on ${host}:${port}`);
});

*/

/*
// serving from HTML file
const http = require('http');
const fs = require('fs').promises;

const host = 'localhost';
const port = 8000;

const server = http.createServer((req, res) => {
    fs.readFile(`${__dirname}/index.html`)
        .then((contents) => {
            res.setHeader('Content-Type', 'text/html');
            res.writeHead(200);
            res.end(contents);
        })
        .catch((err) => {
            res.writeHead(500);
            res.end(err);
        });
});

server.listen(port, host, () => {
    console.log(`Server Listening on ${host}:${port}`);
});
*/

/*
// Read Stream simple

const fs = require('fs');

const readStream = fs.createReadStream(`${__dirname}/big.txt`);
readStream.on('data', (chunk) => {
   // console.log(chunk.toString());
});

console.log('I am first');
*/

/*
// Read from FORM

const http = require('http');

const port = 8000;
const host = 'localhost';

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.setHeader('Content-type', 'text/html');
        res.writeHead(200);
        res.write(
            '<html><title></title><form method="post" action="/process"><input name="message"></form><body></body></html>',
        );
    } else if (req.url === '/process' && req.method === 'POST') {
        const data = [];
        req.on('data', (chunk) => {
            data.push(chunk);
        });

        req.on('end', () => {
            const fulltext = Buffer.concat(data).toString();
            console.log(fulltext);
            res.write('Thanks for submitting');
            res.end();
        });
    } else {
        res.write('Not Found');
        res.end();
    }
});

server.listen(port, host, () => {
    console.log(`Listening on ${host}:${port}`);
});
*/

/*
Reading from file and response back to user

const http = require('http');
const fs = require('fs');

const port = 8000;
const host = 'localhost';

const server = http.createServer((req, res) => {
    const readStream = fs.createReadStream(`${__dirname}/big.txt`);
    readStream.pipe(res);
});

server.listen(port, host, () => {
    console.log(`Listening on ${host}:${port}`);
}); 
*/
