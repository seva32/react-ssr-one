/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { signout, refreshToken } from '../../store/actions';

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
        this.timeoutRunning = true;
        this.timer = setTimeout(this.logout, this.timeRemainingUntilLogout);
      }
    };

    resetTimeout = () => {
      console.log('++++++++++');
      console.log(this.timeRemainingUntilLogout);
      console.log(this.timeoutRunning);
      console.log('props :::::: ', this.props);
      // this.setState((prevState) => ({ ...prevState }));
      this.clearTimeoutFunc();
      this.setTimeoutRun();
    };

    warn = () => {
      clearTimeout(this.timer);
    };

    logout = () => {
      const {
        history: { push }, // eslint-disable-line
      } = this.props;

      this.props.refreshToken((success) => {
        if (!success) {
          this.props.signout(() => {
            console.log('----------');
            push('/signin');
            // window.location.assign('/signin');
          });
        } else {
          this.resetTimeout();
        }
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

        if (this.timeoutRunning) {
          this.clearTimeoutFunc();
          this.timeoutRunning = false;
        }

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
  return connect(mapStateToProps, { signout, refreshToken })(
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
