import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import omit from 'lodash/omit';

import { Card as StyledCard } from '../../styled/cards';
import RadiksActions from '../../radiks/redux/actions';

class Card extends React.Component {
  onClick = (event) => {
    // console.log('onClick', event.defaultPrevented);
    if (!event.defaultPrevented) {
      this.props.selectModel(this.props.card);
    }
  }

  render() {
    const { card, ...rest } = omit(this.props, Object.keys(RadiksActions));
    return (
      <StyledCard
        {...rest}
        onClick={event => this.onClick(event)}
      />
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(Object.assign({}, RadiksActions), dispatch);

export default connect(null, mapDispatchToProps)(Card);
