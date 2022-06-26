#!/usr/bin/env node

const path = require('path');
const watcher = require('@parcel/watcher');
const { server } = require('./index');
const { generateRoutes } = require('./utils');

// Get port from ivve.config.js
const { port } = require(path.join(process.cwd(), 'ivve.config.js'));

server.listen(port);

watcher
    .subscribe(path.join(process.cwd(), 'src'), (err, events) => {
        if (!err) {
            // Delete require cache
            events.forEach((event) => {
                console.log(`${event.path} route ${event.type}d`);
                delete require.cache[event.path];
            });

            // Set route map again
            generateRoutes();
        } else {
            console.error('Error while watching /src!!!', err);
        }
    })
    .then(() => console.log('Watching /src...'))
    .catch((e) => console.error('Error while watching /src!!!', e));
