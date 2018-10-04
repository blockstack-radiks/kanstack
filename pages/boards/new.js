import React from 'react';
import {
  Flex, Box,
} from 'rebass';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import Router from 'next/router';

import RadiksActions from 'radiks/lib/redux/actions';
import {
  selectModelsById,
} from 'radiks/lib/redux/selectors';

import Head from '../../components/head';
import Nav from '../../components/nav';
import { Card } from '../../components/card';
import Input from '../../components/input';
import Board from '../../models/board';
import Type from '../../styled/typography';
import Button from '../../styled/button';

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
      Router.push(`/boards/${board.id}`);
    }
  }

  save(evt) {
    evt.preventDefault();
    console.log(this.state);
    const { name } = this.state;
    const board = new Board({ name });
    console.log(board);
    this.setState({ boardId: board.id });
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
                <Type.p fontSize={3} mt={0}>Create a Board</Type.p>
                <Input
                  type="text"
                  mt={3}
                  value={this.state.name}
                  placeholder="Board Name"
                  onChange={evt => this.setState({ name: evt.target.value })
                }
                />
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
  boardsById: selectModelsById(state, 'Board'),
});

const mapDispatchToProps = dispatch => bindActionCreators(Object.assign({}, RadiksActions), dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(NewBoard);
