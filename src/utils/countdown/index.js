/* eslint-disable react/destructuring-assignment */
// if (typeof window !== 'undefined') {
//   window.onstorage = () => {
//     console.log(JSON.parse(window.localStorage.getItem('user')));
//   };
// }

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { signout } from '../../store/actions';

export default (ChildComponent) => {
  class ComposedComponent extends Component {
    constructor(props) {
      super(props);
      this.state = {
        warningTime: 1000 * 60 * 0.1,
        signoutTime: 1000 * 60 * 0.2,
      };
    }

    componentDidMount() {
      this.setTimeout();
    }

    clearTimeoutFunc = () => {
      if (this.warnTimeout) clearTimeout(this.warnTimeout);

      if (this.logoutTimeout) clearTimeout(this.logoutTimeout);
    };

    setTimeout = () => {
      this.warnTimeout = setTimeout(this.warn, this.state.warningTime);
      this.logoutTimeout = setTimeout(this.logout, this.state.signoutTime);
    };

    resetTimeout = () => {
      this.clearTimeoutFunc();
      this.setTimeout();
    };

    warn = () => {
      window.alert('You will be logged out automatically in 1 minute');
      // eslint-disable-next-line react/prop-types
      console.log(this.props.auth);
    };

    logout = () => {
      const {
        // eslint-disable-next-line react/prop-types
        history: { push },
      } = this.props;
      // Send a logout request to the API
      console.log('Sending a logout::::', this.props);
      // eslint-disable-next-line react/prop-types
      this.props.signout(() => {
        // eslint-disable-next-line react/prop-types
        push('/signin');
      });
    };

    render() {
      return <ChildComponent {...this.props} />;
    }
  }
  function mapStateToProps(state) {
    return { auth: state.auth.authenticated };
  }
  return connect(mapStateToProps, { signout })(withRouter(ComposedComponent));
};

// opcion a withRouter
// import { useHistory } from "react-router-dom";

// function HomeButton() {
//   let history = useHistory();

//   function handleClick() {
//     history.push("/home");
//   }

//   return (
//     <button type="button" onClick={handleClick}>
//       Go home
//     </button>
//   );
// }
