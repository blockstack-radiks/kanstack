import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'grid-styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { DragDropContext } from 'react-beautiful-dnd';
import { withTheme } from 'styled-components';

import Layout from '../../components/layout';
import CardModal from '../../components/cards/modal';
import CardList from '../../components/cards/list';

import Board from '../../models/board';
import Card from '../../models/card';
import { Header, ListHeader, AddCardButton } from '../../styled/board';

class ShowBoard extends React.Component {
  static getInitialProps({ query }) {
    return {
      boardId: query.id,
    };
  }

  static propTypes = {
    boardId: PropTypes.string.isRequired,
    theme: PropTypes.object.isRequired,
  }

  state = {
    modalIsOpen: false,
    groupedCards: {},
    boardAttrs: {},
  }

  async componentDidMount() {
    NProgress.start();
    const board = await Board.findById(this.props.boardId);
    this.setState({
      boardAttrs: board.attrs,
      allCards: board.cards,
      groupedCards: this.groupedCards(board.cards),
    }, () => {
      NProgress.done();
    });
    Card.addStreamListener(this.newCardListener.bind(this));
  }

  componentWillUnmount() {
    Card.removeStreamListener(this.newCardListener);
  }

  saveListOrder = cards => cards.map((card, index) => new Promise(async (resolve, reject) => {
    try {
      card.attrs.order = index;
      await card.save();
      resolve();
    } catch (error) {
      console.log(error);
      reject(error);
    }
  }))

  onDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      console.log('Reordering the same list');
      const status = source.droppableId;
      const cards = Array.from(this.state.groupedCards[status]);
      const [moved] = cards.splice(source.index, 1);
      cards.splice(destination.index, 0, moved);
      const { groupedCards } = this.state;
      groupedCards[status] = cards;
      this.setState({ groupedCards });
      const savePromises = this.saveListOrder(cards);
      await Promise.all(savePromises);
      this.setState({ groupedCards });
    } else {
      console.log('Moving to a different list');
      const { groupedCards } = this.state;
      const fromList = groupedCards[source.droppableId];
      const toList = groupedCards[destination.droppableId];
      const [card] = fromList.splice(source.index, 1);
      card.attrs.status = destination.droppableId;
      toList.splice(destination.index, 0, card);
      groupedCards[source.droppableId] = fromList;
      groupedCards[destination.droppableId] = toList;
      this.setState({ groupedCards });
      let savePromises = this.saveListOrder(fromList);
      savePromises = savePromises.concat(this.saveListOrder(toList));
      await Promise.all(savePromises);
      this.setState({ groupedCards });
    }
  }

  groupedCards = (cards) => {
    const grouped = {
      todo: [],
      doing: [],
      done: [],
    };
    cards.forEach((card) => {
      grouped[card.attrs.status].push(card);
    });
    return grouped;
  }

  newCardListener(card) {
    console.log('new card in boards#show', card, this.state.allCards);
    if (card.attrs.boardId !== this.props.boardId) {
      return true;
    }
    const { allCards } = this.state;
    let { groupedCards } = this.state;
    const cardIndex = allCards.findIndex(_card => card._id === _card._id);
    if (cardIndex !== -1) {
      allCards[cardIndex] = card;
      groupedCards = this.groupedCards(allCards);
    } else {
      groupedCards[card.attrs.status].unshift(card);
      allCards.unshift(card);
    }
    this.setState({ groupedCards, allCards });
    return true;
  }

  newCard(card, isNew) {
    this.setState({
      modalIsOpen: false,
    });
    // console.log('newCard', isNew, card);
    let { groupedCards } = this.state;
    if (isNew) {
      groupedCards[card.attrs.status].unshift(card);
    } else {
      // console.log(card);
      const { allCards } = this.state;
      const cardIndex = allCards.findIndex(_card => card._id === _card._id);
      allCards[cardIndex] = card;
      groupedCards = this.groupedCards(allCards);
    }
    this.setState({ groupedCards });
  }

  render() {
    const { theme } = this.props;
    const { boardAttrs } = this.state;
    const { name } = boardAttrs;
    const cardsByStatus = this.state.groupedCards;
    return (
      <Layout useContainer={false}>
        <Header>
          <h1>
            {name || 'fetching...'}
            <AddCardButton onClick={() => this.setState({ modalIsOpen: true })}>
              <FontAwesomeIcon icon={faPlus} />
            </AddCardButton>
          </h1>
        </Header>
        <Flex>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Box width={[1 / 3]}>
              {/* <ListHeader color="rgba(187, 107, 217, .31)"> */}
              <ListHeader color={theme.solarized.violet}>
                todo
              </ListHeader>
              <CardList cards={cardsByStatus.todo} status="todo" />
            </Box>
            <Box width={[1 / 3]}>
              <ListHeader color={theme.solarized.magenta}>
                doing
              </ListHeader>
              <CardList cards={cardsByStatus.doing} status="doing" />
            </Box>
            <Box width={[1 / 3]}>
              <ListHeader color={theme.solarized.green} last>
                done
              </ListHeader>
              <CardList cards={cardsByStatus.done} status="done" />
            </Box>
          </DragDropContext>
        </Flex>
        <CardModal
          isOpen={this.state.modalIsOpen}
          onClose={() => this.setState({ modalIsOpen: false })}
          onSave={(data, isNew) => this.newCard(data, isNew)}
          boardId={this.props.boardId}
          userGroupId={this.state.boardAttrs.userGroupId}
        />

      </Layout>
    );
  }
}

export default withTheme(ShowBoard);
