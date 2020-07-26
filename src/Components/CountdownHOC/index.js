/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  signout,
  refreshToken,
  resfreshTokenRestartTimeout,
} from '../../store/actions';

export default (ChildComponent) => {
  class ComposedComponent extends Component {
    // constructor(props) {
    //   super(props);
    //   this.state = { signinState: false };
    // }

    componentDidMount() {
      this.startCountdown();
    }

    componentDidUpdate() {
      this.startCountdown();
    }

    clearTimeoutFunc = () => {
      if (this.timer) clearTimeout(this.timer);
    };

    setTimeoutRun = () => {
      if (this.timeRemainingUntilLogout && this.timeRemainingUntilLogout > 0) {
        // flag a STO running
        this.timeoutRunning = true;
        this.timer = setTimeout(this.logout, this.timeRemainingUntilLogout);
      }
    };

    // send action and update component store
    resetTimeout = () => {
      this.props.resfreshTokenRestartTimeout();
    };

    logout = () => {
      const {
        history: { push }, // eslint-disable-line
      } = this.props;

      // this check is for the case when user signed out
      // to stop refresh token process
      if (
        !(
          this.props.auth !== null &&
          this.props.auth !== undefined &&
          this.props.auth
        )
      ) {
        this.clearTimeoutFunc();
      } else {
        this.props.refreshToken((success) => {
          if (!success) {
            this.props.signout(() => {
              push('/signin');
            });
          } else {
            this.resetTimeout();
          }
        });
      }
    };

    startCountdown() {
      if (
        this.props.auth !== null &&
        this.props.auth !== undefined &&
        this.props.auth
      ) {
        // check time from actual singin session
        const timeFromLogin = Date.now() - this.props.startTime;
        // private prop, useless in state and accesible from STO func
        this.timeRemainingUntilLogout = this.props.expiry - timeFromLogin;
        // check if there is a timeout already running from previous store change
        // if true invalidate the STO and start with the last component update
        if (this.timeoutRunning) {
          this.clearTimeoutFunc();
          this.timeoutRunning = false;
        }
        // timeRemainingUntilLogout is < when component updates and
        // refresh token process doesnt updated the store yet
        if (this.timeRemainingUntilLogout > 0) {
          this.setTimeoutRun();
        }
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
    resfreshTokenRestartTimeout: PropTypes.func,
  };

  ComposedComponent.defaultProps = {
    auth: '',
    startTime: null,
    expiry: null,
    signout: () => {},
    refreshToken: () => {},
    resfreshTokenRestartTimeout: () => {},
  };

  function mapStateToProps({ auth }) {
    return {
      expiry: auth.expiry.expiryToken * 1000, // llega en segundos
      startTime: auth.expiry.startTime, // llega en milisegundos
      auth: auth.authenticated,
    };
  }
  return connect(mapStateToProps, {
    signout,
    refreshToken,
    resfreshTokenRestartTimeout,
  })(withRouter(ComposedComponent));
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
