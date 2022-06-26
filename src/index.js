const http = require('http');
const { generateRoutes, handleReq } = require('./utils');

const server = http.createServer();

server.on('listening', () => {
    generateRoutes();
    console.log(`Server started listening on ${server.address().port}...`);
});
server.on('clientError', (err) => console.error(err));
server.on('close', () => console.log('Shutting down!'));

server.on('request', (req, res) => {
    console.log(`${new Date().toLocaleString()}: ${req.method} ${req.url}`);

    try {
        handleReq(req, res);
    } catch (e) {
        if (
            e.code === 'MODULE_NOT_FOUND' ||
            e.message.includes('MODULE_NOT_FOUND')
        ) {
            console.log(`${req.url} route not found!`);
            res.statusCode = 404;
            res.end('Route not found');
        } else {
            console.error(`Error at ${req.url}!!!`, e);
            res.statusCode = 500;
            res.end('Internal Server Error');
        }
    }
});

module.exports = { server, setRoutes };
