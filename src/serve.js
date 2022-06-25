const server = require('./index');
const path = require('path');
const { port } = require(path.join(process.cwd(), 'ivve.config.js'));

server.listen(port);
