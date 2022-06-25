#!/usr/bin/env node

const watcher = require('@parcel/watcher');
const path = require('path');

watcher
    .subscribe(path.join(process.cwd(), 'src'), (err, events) =>
        console.log(events)
    )
    .then(() => console.log('Started watching /src'));
