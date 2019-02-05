import React from 'react';
import PropTypes from 'prop-types';
import { Box } from 'grid-styled';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import Card from './show';

class CardList extends React.Component {
  static propTypes = {
    cards: PropTypes.array,
    status: PropTypes.string.isRequired,
  }

  static defaultProps = {
    cards: [],
  }

  list() {
    const { cards } = this.props;
    return cards.map((card, index) => (
      <Draggable key={card._id} draggableId={card._id} index={index}>
        {provided => (
          <Card
            innerRef={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            card={card}
            // style={provided.draggableProps.style}
          >
            {card.attrs.name}
          </Card>
        )}
      </Draggable>
    ));
  }

  render() {
    return (
      <Droppable droppableId={this.props.status}>
        {(provided, snapshot) => (
          <Box
            innerRef={provided.innerRef}
            p={2}
            // style={getListStyle(snapshot.isDraggingOver)}
          >

            {this.list(provided)}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    );
  }
}

export default CardList;
