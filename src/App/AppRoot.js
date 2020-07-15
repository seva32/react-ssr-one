import '@babel/polyfill';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes';
import ScrollToTop from '../Components/ScrollToTop.tsx';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // eslint-disable-next-line no-restricted-globals
    return (
      <Router>
        <ScrollToTop>
          <Routes />
        </ScrollToTop>
      </Router>
    );
  }
}
