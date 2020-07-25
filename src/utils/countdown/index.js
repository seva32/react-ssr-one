/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { signout, getCurrentUser, refreshToken } from '../../store/actions';

export default (ChildComponent) => {
  class ComposedComponent extends Component {
    componentDidMount() {
      this.startCountdown();
    }

    componentDidUpdate() {
      this.startCountdown();
    }

    clearTimeoutFunc = () => {
      if (this.warnTimeout) clearTimeout(this.warnTimeout);
      if (this.logoutTimeout) clearTimeout(this.logoutTimeout);
    };

    setTimeoutRun = () => {
      if (this.timeRemainingUntilLogout) {
        if (this.timeRemainingUntilLogout <= 0) {
          this.logout();
        } else {
          this.timer = setInterval(this.logout, this.timeRemainingUntilLogout);
        }
      }
      // this.logoutTimeout = setTimeout(this.logout, signoutTime);
    };

    resetTimeout = () => {
      this.clearTimeoutFunc();
      this.setTimeoutRun();
    };

    warn = () => {
      clearInterval(this.timer);
    };

    logout = () => {
      const {
        history: { push }, // eslint-disable-line
      } = this.props;
      clearInterval(this.timer);

      // check for refresh token help
      this.props.refreshToken((success) => {
        if (!success) {
          this.props.signout(() => {
            push('/signin');
            window.location.assign('/signin');
          });
        }
        alert('Keep going!');
      });
    };

    startCountdown() {
      if (
        this.props.auth !== null &&
        this.props.auth !== undefined &&
        this.props.auth
      ) {
        const timeFromLogin = Date.now() - this.props.startTime;
        this.timeRemainingUntilLogout = this.props.expiry - timeFromLogin;
        this.setTimeoutRun();
      }
    }

    render() {
      return <ChildComponent {...this.props} />;
    }
  }

  ComposedComponent.propTypes = {
    auth: PropTypes.string,
    startTime: PropTypes.number,
    expiry: PropTypes.number,
    signout: PropTypes.func,
    refreshToken: PropTypes.func,
  };

  ComposedComponent.defaultProps = {
    auth: '',
    startTime: null,
    expiry: null,
    signout: () => {},
    refreshToken: () => {},
  };

  function mapStateToProps({ auth }) {
    return {
      expiry: auth.expiry.expiryToken * 1000, // llega en segundos
      startTime: auth.expiry.startTime, // llega en milisegundos
      auth: auth.authenticated,
    };
  }
  return connect(mapStateToProps, { signout, getCurrentUser, refreshToken })(
    withRouter(ComposedComponent),
  );
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
