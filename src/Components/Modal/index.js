/* eslint-disable react/destructuring-assignment */
import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import StyledModal from './Modal.style';
import useScape from './useScape';

let modalRoot = null;
if (typeof window !== 'undefined') {
  modalRoot = document.getElementById('modal-root');
}

function Modal({
  isOpen,
  onClose,
  id,
  children,
  modalClass,
  modalSize,
  title,
}) {
  const [fadeType, setFadeType] = React.useState(null);

  const background = React.createRef();

  useScape(() => setFadeType('out'));

  React.useEffect(() => {
    setFadeType('in');
    if (!isOpen) {
      setFadeType('out');
    }
  }, [setFadeType, isOpen]);

  const transitionEnd = (e) => {
    if (e.propertyName !== 'opacity' || fadeType === 'in') return;

    if (fadeType === 'out') {
      onClose();
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    setFadeType('out');
  };

  return ReactDom.createPortal(
    <StyledModal
      id={id}
      className={`wrapper ${`size-${modalSize}`} fade-${fadeType} ${modalClass}`}
      role="dialog"
      modalSize={modalSize}
      onTransitionEnd={transitionEnd}
    >
      <div className="box-dialog">
        <div className="box-header">
          <h4 className="box-title">{title}</h4>
          <button onClick={handleClick} className="close" type="button">
            ×
          </button>
        </div>
        <div className="box-content">{children}</div>
        <div className="box-footer">
          <button onClick={handleClick} className="close" type="button">
            Close
          </button>
        </div>
      </div>
      <div
        className="background"
        onMouseDown={handleClick}
        ref={background}
        role="button"
        tabIndex="0"
      />
    </StyledModal>,
    modalRoot,
  );
}

Modal.propTypes = {
  id: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  modalClass: PropTypes.string,
  modalSize: PropTypes.string,
  title: PropTypes.string,
};

Modal.defaultProps = {
  modalClass: '',
  modalSize: 'md',
  title: 'Heads up!',
};

export default Modal;

// class Modal extends Component {
//   state = { fadeType: null }; // eslint-disable-line

//   background = React.createRef();

//   componentDidMount() {
//     window.addEventListener('keydown', this.onEscKeyDown, false);
//     setTimeout(() => this.setState({ fadeType: 'in' }), 0);
//   }

//   componentDidUpdate(prevProps, _prevState) {
//     if (!this.props.isOpen && prevProps.isOpen) {
//       this.setState({ fadeType: 'out' }); // eslint-disable-line
//     }
//   }

//   componentWillUnmount() {
//     window.removeEventListener('keydown', this.onEscKeyDown, false);
//   }

//   transitionEnd = (e) => {
//     if (e.propertyName !== 'opacity' || this.state.fadeType === 'in') return;

//     if (this.state.fadeType === 'out') {
//       this.props.onClose();
//     }
//   };

//   onEscKeyDown = (e) => {
//     if (e.key !== 'Escape') return;
//     this.setState({ fadeType: 'out' });
//   };

//   handleClick = (e) => {
//     e.preventDefault();
//     this.setState({ fadeType: 'out' });
//   };

//   render() {
//     return ReactDom.createPortal(
//       <StyledModal
//         id={this.props.id}
//         className={`wrapper ${`size-${this.props.modalSize}`} fade-${
//           this.state.fadeType
//         } ${this.props.modalClass}`}
//         role="dialog"
//         modalSize={this.props.modalSize}
//         onTransitionEnd={this.transitionEnd}
//       >
//         <div className="box-dialog">
//           <div className="box-header">
//             <h4 className="box-title">{this.props.title}</h4>
//             <button onClick={this.handleClick} className="close" type="button">
//               ×
//             </button>
//           </div>
//           <div className="box-content">{this.props.children}</div>
//           <div className="box-footer">
//             <button onClick={this.handleClick} className="close" type="button">
//               Close
//             </button>
//           </div>
//         </div>
//         <div
//           className="background"
//           onMouseDown={this.handleClick}
//           ref={this.background}
//           role="button"
//           tabIndex="0"
//         />
//       </StyledModal>,
//       modalRoot,
//     );
//   }
// }
