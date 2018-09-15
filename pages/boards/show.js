import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Flex, Box } from 'grid-styled';

import Layout from '../../components/layout';
import CardModal from '../../components/cards/modal';

import Board from '../../models/board';
import { Header, ListHeader } from '../../styled/board';

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
  }

  static defaultProps = {
    boardAttrs: {},
  }

  state = {
    modalIsOpen: true,
  }

  async componentDidMount() {
    const board = new Board({ id: this.props.boardId });
    this.props.fetchModel(board);
  }

  saveCard(data) {
    console.log(data);
    this.setState({
      modalIsOpen: false,
    });
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log('nextProps', nextProps);
  // }

  render() {
    const { boardAttrs } = this.props;
    const { name } = boardAttrs;
    return (
      <Layout useContainer={false}>
        <Header>
          <h1>
            {name || 'fetching...'}
          </h1>
        </Header>
        <Flex>
          <Box width={[1 / 3]}>
            <ListHeader bg="rgba(187, 107, 217, .31)">
              todo
            </ListHeader>
          </Box>
          <Box width={[1 / 3]}>
            <ListHeader bg="rgba(242, 153, 73, .3)">
              doing
            </ListHeader>
          </Box>
          <Box width={[1 / 3]}>
            <ListHeader bg="rgba(39, 174, 96, .39)">
              done
            </ListHeader>
          </Box>
        </Flex>
        <CardModal
          isOpen={this.state.modalIsOpen}
          onClose={() => this.setState({ modalIsOpen: false })}
          onSave={data => this.saveCard(data)}
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
  };
};

const mapDispatchToProps = dispatch => bindActionCreators(Object.assign({}, RadiksActions), dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ShowBoard);
