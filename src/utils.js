const dirTree = require('directory-tree');
const path = require('path');
const url = require('url');

let routes = [];
const generateRoutes = () => {
    dirTree(
        path.join(process.cwd(), 'src'),
        { extensions: /\.js/ },
        (item, filePath, __) => {
            let regex = filePath
                .replace(path.join(process.cwd(), 'src'), '')
                .replace('.js', '')
                .replaceAll('\\', '/')
                .replaceAll('/index', '')
                .replace(/\$\w+/g, '\\w+');

            regex = '^' + regex + '$';

            routes.push({ filePath, regex });
        }
    );

    routes = routes.reverse();
};

const handleReq = (req, res) => {
    const reqURL = url.parse(req.url);

    // remove trailing slash
    if (reqURL.pathname.endsWith('/')) {
        reqURL.pathname = reqURL.pathname.slice(0, -1);
    }

    const route = routes.find((route) => {
        return reqURL.pathname.search(new RegExp(route.regex)) !== -1;
    });

    if (route) {
        require(route.filePath)(req, res);
    } else throw new Error('MODULE_NOT_FOUND');
};

module.exports = { generateRoutes, handleReq };
