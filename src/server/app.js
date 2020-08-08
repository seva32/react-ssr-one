/* eslint-disable no-console */
import webpack from 'webpack';
import webpackHotServerMiddleware from 'webpack-hot-server-middleware';
import throng from 'throng';

import configDevClient from '../../config/webpack.dev-client';
import configDevServer from '../../config/webpack.dev-server';
import configProdClient from '../../config/webpack.prod-client';
import configProdServer from '../../config/webpack.prod-server';
import server from './api/express';

import db from './api/models';
import initial from './api/models/initial';

const expressStaticGzip = require('express-static-gzip');

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;
const PORT = process.env.PORT || 8080;
const HOST = process.env.SERVER_HOST || '0.0.0.0';
let isBuilt = false;
const WORKERS = process.env.WEB_CONCURRENCY || 1;

function start() {
  const Role = db.role;
  db.mongoose
    .connect(process.env.MONGOOSE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Successfully connect to MongoDB.');
      initial(Role);
    })
    .catch((err) => {
      console.error('MongoDB connection error', err);
      process.exit();
    });

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
      server.use(render({ clientStats }));
      done();
    });
  }
}

throng(
  {
    workers: WORKERS,
    lifetime: Infinity,
  },
  start,
);
