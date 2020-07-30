import React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AppContainer } from 'react-hot-loader';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AppRoot from './App/AppRoot';
import storeConfig from './store';

const { store, persistor } = storeConfig;

const renderApp =
  typeof window === 'undefined' ? ReactDOM.render : ReactDOM.hydrate;

function render(Component) {
  renderApp(
    <HelmetProvider>
      <AppContainer>
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Component />
          </PersistGate>
        </ReduxProvider>
      </AppContainer>
    </HelmetProvider>,
    document.getElementById('react-root'),
  );
}

render(AppRoot);

if (module.hot) {
  module.hot.accept('./App/AppRoot.js', () => {
    const NewAppRoot = require('./App/AppRoot.js').default;
    render(NewAppRoot);
  });
}
