import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RedirectWithStatus } from '../../Components';
import * as actions from '../../store/actions';

function Signout({ signout }) {
  useEffect(() => {
    signout();
  }, [signout]);
  return (
    <div>
      <RedirectWithStatus from="/signout" to="/" status={300} />
    </div>
  );
}

Signout.propTypes = {
  signout: PropTypes.func,
};

Signout.defaultProps = {
  signout: () => {},
};

export default connect(null, actions)(Signout);
