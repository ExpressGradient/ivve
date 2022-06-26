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
    let urlInfo = url.parse(req.url);
    let pathname = urlInfo.pathname;

    // remove trailing slash
    if (pathname.endsWith('/')) {
        pathname = pathname.slice(0, -1);
    }

    const route = routes.find((route) => {
        return pathname.search(new RegExp(route.regex)) !== -1;
    });

    if (route) {
        // Extract context from 'ivve.config.js'
        const { context } = require(path.join(process.cwd(), 'ivve.config.js'));
        req.context = context;

        // Add parsed info into req
        req.urlInfo = urlInfo;

        require(route.filePath)(req, res);
    } else throw new Error('MODULE_NOT_FOUND');
};

module.exports = { generateRoutes, handleReq };
