import React from 'react';
import PropTypes from 'prop-types';

import Modal from '../modal';
import Input from '../input';
import { Select, Label } from '../../styled/form';
import Button from '../../styled/button';
import Text from '../../styled/typography';

class CardModal extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isOpen: false,
  }

  state = {
    name: '',
    status: 'todo',
  }

  save() {
    const { name, status } = this.state;
    this.props.onSave({
      name,
      status,
    });
  }

  render() {
    const { isOpen, onClose } = this.props;
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <Text.h2>
          Create a card
        </Text.h2>

        <Label>Name</Label>
        <Input
          type="text"
          placeholder="Name"
          value={this.state.name}
          onChange={evt => this.setState({ name: evt.target.value })}
        />

        <Label>Status</Label>

        <Select
          value={this.state.status}
          onChange={evt => this.setState({ status: evt.target.value })}
        >
          <option value="todo">Todo</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </Select>

        <Button mt={4} onClick={() => this.save()}>
          Save
        </Button>

      </Modal>
    );
  }
}

export default CardModal;
