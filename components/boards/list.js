import React from 'react';
import { Text } from 'rebass';
import { Flex, Box } from 'grid-styled';
import Link from 'next/link';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { CardLink } from '../card';
import Board from '../../models/board';

class BoardsList extends React.Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
  }

  state = {
    boards: [],
  }

  async componentDidMount() {
    const boards = await Board.fetchList({
      createdBy: this.props.username,
    });
    this.setState({ boards });
  }

  boards() {
    return this.state.boards.map(board => (
      <Box width={1 / 3} mt={4} key={board.id} mx={3}>
        <Link href={`/boards/${board.id}`} passHref>
          <CardLink>
            <Text textAlign="center">
              {board.attrs.name}
            </Text>
          </CardLink>
        </Link>
      </Box>
    ));
  }

  render() {
    return (
      <Flex flexDirection="row">
        {this.boards()}
        <Box width={1 / 3} mt={4}>
          <Link href="/boards/new" passHref>
            <CardLink>
              <Text textAlign="center">
                Add a Board
              </Text>
            </CardLink>
          </Link>
        </Box>
      </Flex>
    );
  }
}

const mapStateToProps = state => ({
  username: state.user.currentUser.username,
});

export default connect(mapStateToProps)(BoardsList);
