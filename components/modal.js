import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import {
  Content, Backdrop, Modal as StyledModal, CloseButton,
} from '../styled/modal';

class Modal extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    children: PropTypes.node.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isOpen: false,
  }

  render() {
    const { isOpen, children } = this.props;
    if (!isOpen) return '';
    return (
      <StyledModal>
        <Content width={[1, 0.64, 0.65, 0.5]} px={3} pb={3}>
          <CloseButton onClick={() => { this.props.onClose(); }}>
            <FontAwesomeIcon icon={faTimes} />
          </CloseButton>
          {children}
        </Content>
        <Backdrop onClick={() => { this.props.onClose(); }} />
      </StyledModal>
    );
  }
}

export default Modal;
