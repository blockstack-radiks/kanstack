import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

// import RadiksActions from 'radiks/lib/redux/actions';
import {
  selectModelsById, selectCurrentlySavingModel, selectSelectedModel,
} from 'radiks/lib/redux/selectors';
import BoardActions from '../../stores/board/actions';

import Modal from '../modal';
import Input from '../input';
import { Select, Label } from '../../styled/form';
import Button from '../../styled/button';
import Text from '../../styled/typography';

import Card from '../../models/card';

const defaultState = {
  name: '',
  status: 'todo',
  cardId: null,
  card: null,
  isSaving: false,
};

class CardModal extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    boardId: PropTypes.string.isRequired,
    // cardsById: PropTypes.object,
    // saveModel: PropTypes.func.isRequired,
    savedCard: PropTypes.func.isRequired,
    // currentlySaving: PropTypes.bool.isRequired,
    selectedCard: PropTypes.object,
    // deselectModel: PropTypes.func.isRequired,
    deselectCard: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isOpen: false,
    // cardsById: {},
    selectedCard: null,
  }

  state = defaultState

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedCard) {
      const { name, status } = nextProps.selectedCard.attrs;
      this.setState({
        name,
        status,
        // cardId: id,
      });
    }
    // const card = nextProps.cardsById[this.state.cardId];
    // if (!this.state.cardId && nextProps.selectedCard) {
    //   const { name, id, status } = nextProps.selectedCard.attrs;
    //   this.setState({
    //     name,
    //     status,
    //     cardId: id,
    //   });
    // } else if (this.props.currentlySaving && !nextProps.currentlySaving) {
    //   console.log('saved!');
    //   this.props.onSave(card, !this.props.selectedCard);
    //   this.props.deselectModel(card);
    //   this.setState(defaultState);
    // } else if (!this.state.card && card) {
    //   this.setState({
    //     card,
    //   });
    // }
  }

  onClose() {
    // if (this.props.selectedCard) {
    //   this.props.deselectModel(this.props.selectedCard);
    // }
    this.props.deselectCard();
    this.props.onClose();
  }

  async save() {
    const { name, status } = this.state;
    const card = this.props.selectedCard || new Card({ boardId: this.props.boardId });
    const isNew = !this.props.selectedCard;
    this.setState({
      isSaving: true,
    });
    card.update({
      name,
      status,
    });
    console.log(card.attrs);
    await card.save();
    this.setState({
      isSaving: false,
      ...defaultState,
    });
    this.props.savedCard(card);
    this.props.onSave(card, isNew);
    // this.setState({
    //   cardId: card._id,
    // }, () => {
    //   this.props.saveModel(card);
    // });
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
    const { name } = this.state;
    return (
      <>
        <Text.h1 textAlign="center" mt={4}>
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
        </Text.h1>
        <Text.p textAlign="center" mt={4}>
          Saving
          {' '}
          {'"'}
          {name}
          {'"'}
        </Text.p>
      </>
    );
  }

  render() {
    const { isOpen, selectedCard } = this.props;
    const { isSaving } = this.state;
    return (
      <Modal isOpen={isOpen || !!selectedCard} onClose={() => this.onClose()}>
        {isSaving ? this.savingView() : this.form()}
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  cardsById: selectModelsById(state, 'Card'),
  currentlySaving: selectCurrentlySavingModel(state, 'Card'),
  // selectedCard: selectSelectedModel(state, 'Card'),
  selectedCard: state.board.selectedCard,
});

console.log(Object.keys(BoardActions));

const mapDispatchToProps = dispatch => bindActionCreators(Object.assign({}, BoardActions), dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CardModal);
