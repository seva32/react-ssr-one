import React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AppContainer } from 'react-hot-loader';
import { Provider as ReduxProvider } from 'react-redux';
import AppRoot from './App/AppRoot';
import storeConfig from './store';

const { store, persistor } = storeConfig;

function render(Component) {
  persistor.subscribe(() => {
    const { bootstrapped } = persistor.getState();
    if (bootstrapped) {
      ReactDOM.hydrate(
        <HelmetProvider>
          <AppContainer>
            <ReduxProvider store={store}>
              <Component />
            </ReduxProvider>
          </AppContainer>
        </HelmetProvider>,
        document.getElementById('react-root'),
      );
    }
  });
}

render(AppRoot);

if (module.hot) {
  module.hot.accept('./App/AppRoot.js', () => {
    const NewAppRoot = require('./App/AppRoot.js').default;
    render(NewAppRoot);
  });
}
