/* eslint-disable no-console */
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path'; // eslint-disable-line
import webpack from 'webpack';
import webpackHotServerMiddleware from 'webpack-hot-server-middleware';
import bodyParser from 'body-parser';

import configDevClient from '../../config/webpack.dev-client';
import configDevServer from '../../config/webpack.dev-server';
import configProdClient from '../../config/webpack.prod-client';
import configProdServer from '../../config/webpack.prod-server';
import storeMiddleware from './middleware/store';
// import appRouter from './router/router';

const server = express();

const expressStaticGzip = require('express-static-gzip');

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;
const PORT = process.env.PORT || 8080;
let isBuilt = false;

server.set('x-powered-by', false);
server.use(bodyParser.json({ type: '*/*' }));
server.use(cookieParser());

const done = () => {
  !isBuilt &&
    server.listen(PORT, () => {
      isBuilt = true;
      console.log(
        `Server listening on \x1b[42m\x1b[1mhttp://localhost:${PORT}\x1b[0m in \x1b[41m${process.env.NODE_ENV}\x1b[0m 🌎...`,
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

  // appRouter(server);
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
    // appRouter(server);
    server.use(storeMiddleware());
    server.use(render({ clientStats }));
    done();
  });
}
