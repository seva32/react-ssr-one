import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { Provider } from 'react-redux';
import { matchRoutes } from 'react-router-config';
import { HelmetProvider } from 'react-helmet-async';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
import serialize from 'serialize-javascript';
import Routes, { routes } from '../App/Routes';
// import createStore from './createStore';

export default ({ clientStats }) => (req, res) => {
  // const store = createStore();
  const { store } = req;
  // prettier-ignore
  // const promises = matchRoutes(routes, req.path)
  //   .map(({ route }) => (route.loadData ? route.loadData(store) : Promise.resolve(null)));

  const promises = matchRoutes(routes, req.path).map(({ route }) => {
    if (route.loadData) {
      const prom = route.loadData(store);
      console.log(store.getState());
      return prom;
    }
    return Promise.resolve(null);
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
      // eslint-disable-next-line no-console
      console.log('Error 404: ', req.originalUrl);
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
              <link
                rel="stylesheet"
                href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
              />
              ${styles}${helmet.title}
              ${helmet.meta.toString()}
              ${helmet.link.toString()}
            </head>
            <body>
              <div id="react-root">${app}</div>
              ${js}
              ${cssHash}
              <script>window.REDUX_DATA = ${reduxData}</script>
            </body>
          </html>`,
    );
  });
};
