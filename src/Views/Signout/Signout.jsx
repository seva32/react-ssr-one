import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { RedirectWithStatus } from '../../Components';
import * as actions from '../../store/actions';

function Signout({ signout, history }) {
  useEffect(() => {
    signout(() => {
      history.push('/');
    });
  }, [signout, history]);
  return null;
  // return (
  //   <div>
  //     <RedirectWithStatus from="/signout" to="/" status={300} />
  //   </div>
  // );
}

Signout.propTypes = {
  signout: PropTypes.func,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};

Signout.defaultProps = {
  signout: () => {},
};

export default connect(null, actions)(Signout);
