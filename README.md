# IVVE
A Node.js HTTP Server with File based Routing inspired by Vercel's Serverless Functions.

> Note: The server is slow when compared with standards like Fastify and Express. Development in progress, will try to improve the performance. Don't use in production yet.

## Installation
```
npm install ivve@latest
```

## Routing
* In an NPM project with `ivve` installed, make a `src` folder next to your `package.json` where all your routes go.
* Every file in the `src` folder will become a route.
* ```
  - /node_modules
  - package.json
  - package-lock.json
  - /src
      - index.js
      - about.js
      - /posts
          - $id.js
  ```
* Add `$` before a filename to make it a dynamic route that catches dynamic params.
* There are three endpoints in above example,
  * /
  * /about
  * /posts/w+

## Route Handler
* Each file should export a default function taking `req: http.IncomingMessage` and `res: http.ServerResponse`.
* ```javascript
  // index.js
  module.exports = (req, res) => res.end("Welcome Home!");
  ```

## Ivve Config
* You can configure some parts of the server using the config file.
* ```javascript
  // ivve.config.js
  module.exports = {
    port: 3000, // required
    context: {
      db: prisma,
      auth: supabase.auth
    }
  }
  ```
* Context is an object that is attached the `req` to be used across all the routes. You can access context using `req.context`

## Running the server
* Ivve comes with parcel watcher that watches the `src` folder for any changes and hot reloads.
* Run the dev server using the dev script from the root path next to `package.json`.
* ```
  npx -p ivve dev
  ```
* To run the production server, use the `serve` script.
* ```
  npx -p ivve serve
  ```

## Built with
* [Parcel Watcher](https://github.com/parcel-bundler/watcher)
* [Directory Tree](https://github.com/mihneadb/node-directory-tree)
