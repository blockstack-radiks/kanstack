import React from 'react';
import {
  Flex, Box, Text, Button,
} from 'rebass';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import Router from 'next/router';

import Head from '../../components/head';
import Nav from '../../components/nav';
import { Card } from '../../components/card';
import Input from '../../components/input';
import Board from '../../models/board';

import RadiksActions from '../../radiks/redux/actions';
import {
  // selectCurrentlySavingModel,
  selectModelsById,
  // selectModels,
  // selectIsFetchingModels,
} from '../../radiks/redux/selectors';

class NewBoard extends React.Component {
  state = {
    name: '',
    boardId: null,
  }

  static propTypes = {
    saveModel: PropTypes.func.isRequired,
    boardsById: PropTypes.object,
  }

  static defaultProps = {
    boardsById: {},
  }

  componentWillReceiveProps(nextProps) {
    const board = nextProps.boardsById[this.state.boardId];
    if (board && !board.currentlySaving) {
      Router.push(`/boards/${board.uuid}`);
    }
  }

  save(evt) {
    evt.preventDefault();
    console.log(this.state);
    const { name } = this.state;
    const board = new Board({ name });
    console.log(board);
    this.setState({ boardId: board.uuid });
    this.props.saveModel(board);
  }

  render() {
    return (
      <>
        <Head />
        <Nav />
        <Flex>
          <Box width={1 / 2} mx="auto" mt={3}>
            <Card>
              <form onSubmit={(evt) => {
                this.save(evt);
              }}
              >
                <Text textAlign="center">
                  <Text fontSize={3}>Create a Board</Text>
                  <Input
                    type="text"
                    mt={3}
                    value={this.state.name}
                    placeholder="Board Name"
                    onChange={evt => this.setState({ name: evt.target.value })
                  }
                  />
                </Text>
                <Button mt={4} d="block" width="100%">Submit</Button>
              </form>
            </Card>
          </Box>
        </Flex>
      </>
    );
  }
}

const mapStateToProps = state => ({
  // board: selectCurrentlySavingModel(state, 'Board'),
  boardsById: selectModelsById(state, 'Board'),
});

const mapDispatchToProps = dispatch => bindActionCreators(Object.assign({}, RadiksActions), dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(NewBoard);
