import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { Provider } from 'react-redux';
import { matchRoutes } from 'react-router-config';
import { HelmetProvider } from 'react-helmet-async';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
import serialize from 'serialize-javascript';
import Routes, { routes } from '../../App/Routes';

export default ({ clientStats }) => async (req, res) => {
  const { store } = req;

  const routesApp = matchRoutes(routes, req.path);

  const promises = routesApp
    .map(({ route }) => (route.loadData ? route.loadData(store) : null))
    .map((promise) => {
      if (promise) {
        // eslint-disable-next-line no-unused-vars
        return new Promise((resolve, reject) => {
          promise.then(resolve).catch(resolve);
        });
      }
      return null;
    });

  Promise.all(promises).then(() => {
    const context = {};
    const helmetContext = {};
    const app = renderToString(
      <HelmetProvider context={helmetContext}>
        <Provider store={store}>
          <StaticRouter location={req.originalUrl} context={context}>
            <Routes />
          </StaticRouter>
        </Provider>
      </HelmetProvider>,
    );

    const { helmet } = helmetContext;

    const { js, styles, cssHash } = flushChunks(clientStats, {
      chunkNames: flushChunkNames(),
    });

    const status = context.status || 200;

    if (context.status === 404) {
      console.log('Error 404: ', req.originalUrl); // eslint-disable-line
    }

    if (context.url) {
      const redirectStatus = context.status || 302;
      res.redirect(redirectStatus, context.url);
      return;
    }

    const reduxData = serialize(store.getState());

    res.status(status).header('Content-Type', 'text/html').send(
      `<!DOCTYPE html>
          <html lang="en">
            <head>
              <meta name="theme-color" content="#000000"/>
              <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
              <link
                rel="stylesheet"
                href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
              />
              ${styles}${helmet.title}
              ${helmet.meta.toString()}
              ${helmet.link.toString()}
              <!--[if lt IE 9]>
                <script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
              <![endif]-->
            </head>
            <body>
              <div id="react-root">${app}</div>
              <div id="modal-root"></div>
              ${js}
              ${cssHash}
              <script>window.REDUX_DATA = ${reduxData}</script>
            </body>
          </html>`,
    );
  });
};
