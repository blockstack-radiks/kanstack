import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import omit from 'lodash/omit';
import BoardActions from '../../stores/board/actions';

import { Card as StyledCard } from '../../styled/cards';

class Card extends React.Component {
  onClick = (event) => {
    // console.log('onClick', event.defaultPrevented);
    if (!event.defaultPrevented) {
      this.props.selectCard(this.props.card);
    }
  }

  render() {
    const { card, ...rest } = omit(this.props, Object.keys(BoardActions));
    return (
      <StyledCard
        {...rest}
        onClick={event => this.onClick(event)}
      />
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  const actions = Object.assign({}, BoardActions);
  return bindActionCreators(actions, dispatch);
};

export default connect(null, mapDispatchToProps)(Card);
