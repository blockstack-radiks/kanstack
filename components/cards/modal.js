import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import Modal from '../modal';
import Input from '../input';
import { Select, Label } from '../../styled/form';
import Button from '../../styled/button';
import Text from '../../styled/typography';

import Card from '../../models/card';
import { decryptObject } from '../../radiks/helpers';

import RadiksActions from '../../radiks/redux/actions';
import {
  selectModelsById,
} from '../../radiks/redux/selectors';

class CardModal extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    boardId: PropTypes.string.isRequired,
    cardsById: PropTypes.object,
    saveModel: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isOpen: false,
    cardsById: {},
  }

  state = {
    name: '',
    status: 'todo',
    cardId: null,
    card: null,
  }

  componentWillReceiveProps(nextProps) {
    // const { cardsById } = nextProps;
    const card = nextProps.cardsById[this.state.cardId];
    if (!this.state.card && card) {
      if (card.currentlySaving) {
        this.setState({
          card,
        });
        this.props.onSave(card);
      } else {
        console.log('saved!');
        this.setState({
          cardId: null,
          card: null,
        });
      }
    }
  }

  save() {
    const { name, status } = this.state;
    const card = new Card({
      name,
      status,
      boardId: this.props.boardId,
    });
    // console.log(card);
    // console.log(card.encrypted());
    // console.log(decryptObject(card.encrypted(), card.constructor));
    // console.log(card.schema);
    this.setState({
      cardId: card.id,
    }, () => {
      this.props.saveModel(card);
    });
  }

  form() {
    return (
      <>
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
      </>
    );
  }

  savingView() {
    const { card } = this.state;
    return (
      <>
        <Text.h1 textAlign="center" mt={4}>
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
        </Text.h1>
        <Text.p textAlign="center" mt={4}>
          Saving
          {' '}
          {'"'}
          {card.attrs.name}
          {'"'}
        </Text.p>
      </>
    );
  }

  render() {
    const { isOpen, onClose } = this.props;
    const { card } = this.state;
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        {card ? this.savingView() : this.form()}
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  cardsById: selectModelsById(state, 'Card'),
});

const mapDispatchToProps = dispatch => bindActionCreators(Object.assign({}, RadiksActions), dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CardModal);
