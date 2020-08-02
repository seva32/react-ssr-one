/* eslint-disable no-console */
// import express from 'express';
// import cookieParser from 'cookie-parser';
import path from 'path'; // eslint-disable-line
import webpack from 'webpack';
import webpackHotServerMiddleware from 'webpack-hot-server-middleware';

import configDevClient from '../../config/webpack.dev-client';
import configDevServer from '../../config/webpack.dev-server';
import configProdClient from '../../config/webpack.prod-client';
import configProdServer from '../../config/webpack.prod-server';
import storeMiddleware from './middleware/store';
import server from './auth-server/express';

const expressStaticGzip = require('express-static-gzip');
const cluster = require('cluster');

// const server = require('./auth0/auth0');

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;
const PORT = process.env.PORT || 8080;
const HOST = process.env.SERVER_HOST || '0.0.0.0';
let isBuilt = false;
const numWorkers = process.env.WEB_CONCURRENCY || 1;

if (cluster.isMaster) {
  // const numWorkers = require('os').cpus().length;

  console.log(`Master cluster setting up ${numWorkers} workers...`);

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`,
    );
    console.log('Starting a new worker');
    cluster.fork();
  });
} else {
  const done = () => {
    !isBuilt &&
      server.listen(PORT, () => {
        isBuilt = true;
        console.log(
          `Server listening on \x1b[42m\x1b[1mhttp://${HOST}:${PORT}\x1b[0m in \x1b[41m${process.env.NODE_ENV}\x1b[0m 🌎...`,
        );
      });
  };

  if (isDev) {
    const compiler = webpack([configDevClient, configDevServer]);

    const clientCompiler = compiler.compilers[0];
    const serverCompiler = compiler.compilers[1]; // eslint-disable-line

    const webpackDevMiddleware = require('webpack-dev-middleware')(
      compiler,
      configDevClient.devServer,
    );

    const webpackHotMiddlware = require('webpack-hot-middleware')(
      clientCompiler,
      configDevClient.devServer,
    );

    server.use(storeMiddleware());
    server.use(webpackDevMiddleware);
    server.use(webpackHotMiddlware);
    server.use(webpackHotServerMiddleware(compiler));
    console.log('Middleware enabled');
    done();
  } else {
    webpack([configProdClient, configProdServer]).run((_err, stats) => {
      const clientStats = stats.toJson().children[0];
      const render = require('../../build/prod-server-bundle.js').default; // eslint-disable-line
      console.log(
        stats.toString({
          colors: true,
        }),
      );
      server.use(
        expressStaticGzip('dist', {
          enableBrotli: true,
        }),
      );
      server.use(storeMiddleware());
      server.use(render({ clientStats }));
      done();
    });
  }
}
