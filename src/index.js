const http = require('http');
const path = require('path');
const url = require('url');
const dirTree = require('directory-tree');

const server = http.createServer();

let routeTree;
const setRouteTree = () =>
    (routeTree = dirTree(path.join(process.cwd(), 'src')));

server.on('listening', () => {
    console.log(`Server started listening on ${server.address().port}...`);
    setRouteTree();
});
server.on('clientError', (err) => console.error(err));
server.on('close', () => console.log('Shutting down!'));

const reqToFile = (pathname) => {
    let filePath = path.join(process.cwd(), 'src');
    const segments = pathname.split('/').slice(1);
    let routeTreeScope = routeTree.children;

    segments.forEach((segment) => {
        const exactMatch = routeTreeScope.find((file) =>
            file.name.includes(segment)
        );

        if (exactMatch) {
            filePath = path.join(filePath, exactMatch.name);
            if (exactMatch.children) {
                routeTreeScope = exactMatch.children;
            }
        } else {
            const slugFile = routeTreeScope.find((file) =>
                file.name.startsWith('$')
            );

            if (slugFile) {
                filePath = path.join(filePath, slugFile.name);
                if (slugFile.children) {
                    routeTreeScope = slugFile.children;
                }
            } else {
                throw new Error('MODULE_NOT_FOUND');
            }
        }
    });

    return filePath;
};

server.on('request', (req, res) => {
    console.log(`${new Date().toLocaleString()}: ${req.method} ${req.url}`);

    try {
        const reqURL = url.parse(req.url);
        const reqFilePath = reqToFile(reqURL.pathname);

        require(reqFilePath)(req, res);
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

module.exports = { server, setRouteTree };
