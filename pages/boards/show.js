import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Flex, Box } from 'grid-styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { DragDropContext } from 'react-beautiful-dnd';

import Layout from '../../components/layout';
import CardModal from '../../components/cards/modal';
import CardList from '../../components/cards/list';

import Board from '../../models/board';
import { Header, ListHeader, AddCardButton } from '../../styled/board';

import RadiksActions from '../../radiks/redux/actions';
import {
  selectModelById,
} from '../../radiks/redux/selectors';

class ShowBoard extends React.Component {
  static getInitialProps({ query }) {
    return {
      boardId: query.id,
    };
  }

  static propTypes = {
    boardId: PropTypes.string.isRequired,
    fetchModel: PropTypes.func.isRequired,
    boardAttrs: PropTypes.object,
    cards: PropTypes.array.isRequired,
  }

  static defaultProps = {
    boardAttrs: {},
  }

  state = {
    modalIsOpen: false,
    groupedCards: {},
  }

  async componentDidMount() {
    const board = new Board({ id: this.props.boardId });
    this.props.fetchModel(board);
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.cards.length > 0) && !this.state.groupedCards.todo) {
      this.setState({
        groupedCards: this.groupedCards(nextProps.cards),
      });
    }
  }

  onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      console.log('Reordering the same list');
      // same list, reorder just this list
      const status = source.droppableId;
      const cards = Array.from(this.state.groupedCards[status]);
      const [moved] = cards.splice(source.index, 1);
      cards.splice(destination.index, 0, moved);
      const { groupedCards } = this.state;
      groupedCards[status] = cards;
      this.setState({ groupedCards });
      const savePromises = cards.map((card, index) => new Promise(async (resolve, reject) => {
        try {
          card.attrs.order = index;
          await card.save();
          resolve();
        } catch (error) {
          console.log(error);
          reject(error);
        }
      }));
      Promise.all(savePromises);
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

  newCard(card) {
    console.log(card);
    this.setState({
      modalIsOpen: false,
    });
  }

  render() {
    const { boardAttrs } = this.props;
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
              <ListHeader bg="rgba(187, 107, 217, .31)">
                todo
              </ListHeader>
              <CardList cards={cardsByStatus.todo} status="todo" />
            </Box>
            <Box width={[1 / 3]}>
              <ListHeader bg="rgba(242, 153, 73, .3)">
                doing
              </ListHeader>
              <CardList cards={cardsByStatus.doing} status="doing" />
            </Box>
            <Box width={[1 / 3]}>
              <ListHeader bg="rgba(39, 174, 96, .39)">
                done
              </ListHeader>
              <CardList cards={cardsByStatus.done} status="done" />
            </Box>
          </DragDropContext>
        </Flex>
        <CardModal
          isOpen={this.state.modalIsOpen}
          onClose={() => this.setState({ modalIsOpen: false })}
          onSave={data => this.newCard(data)}
          boardId={this.props.boardId}
        />

      </Layout>
    );
  }
}

const mapStateToProps = (state, props) => {
  const board = selectModelById(state, 'Board', props.boardId);
  return {
    board,
    boardAttrs: board && board.attrs ? board.attrs : {},
    cards: board && board.cards ? board.cards : [],
  };
};

const mapDispatchToProps = dispatch => bindActionCreators(Object.assign({}, RadiksActions), dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ShowBoard);
