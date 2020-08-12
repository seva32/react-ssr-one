/* eslint-disable indent */
import React from 'react';
import { Button, Modal } from 'semantic-ui-react';
import PropTypes from 'prop-types';

function modalReducer(state, action) {
  switch (action.type) {
    case 'OPEN_MODAL':
      return { open: true, dimmer: action.dimmer };
    case 'CLOSE_MODAL':
      return { open: false };
    default:
      throw new Error();
  }
}

// prettier-ignore
function ModalDimmer({
 mainTitle, mainContent, isOpen, onClose,
}) {
  const [state, dispatch] = React.useReducer(modalReducer, {
    open: false,
    dimmer: undefined,
  });
  const { open, dimmer } = state;

  React.useEffect(() => {
    if (isOpen) {
      dispatch({ type: 'OPEN_MODAL', dimmer: 'blurring' });
    }
  }, [isOpen]);

  const closeModal = (_e) => {
    dispatch({ type: 'CLOSE_MODAL' });
    onClose();
  };

  return (
    <>
      <Modal
        dimmer={dimmer}
        open={open}
        onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
      >
        <Modal.Header>{mainTitle}</Modal.Header>
        <Modal.Content>{mainContent}</Modal.Content>
        <Modal.Actions>
          <Button positive onClick={closeModal}>
            Agree
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}

ModalDimmer.propTypes = {
  mainTitle: PropTypes.string.isRequired,
  mainContent: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ModalDimmer;
