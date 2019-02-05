import React from 'react';
import { Flex, Box } from 'grid-styled';
import Link from 'next/link';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { CardLink } from '../card';
import Board from '../../models/board';
import Type from '../../styled/typography';

class BoardsList extends React.Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
  }

  state = {
    boards: [],
  }

  async componentDidMount() {
    const boards = await Board.fetchOwnList();
    this.setState({ boards });
  }

  boards() {
    return this.state.boards.map(board => (
      <Box width={1 / 3} mt={4} key={board._id} mx={3}>
        <Link href={`/boards/${board._id}`} passHref>
          <CardLink>
            <Type.p my={1} p={0} textAlign="center">
              {board.attrs.name}
            </Type.p>
          </CardLink>
        </Link>
      </Box>
    ));
  }

  render() {
    return (
      <>
        <Type.h1>Your Boards</Type.h1>
        <Flex flexDirection="row">
          {this.boards()}
          <Box width={1 / 3} mt={4}>
            <Link href="/boards/new" passHref>
              <CardLink>
                <Type.p my={1} p={0} textAlign="center">
                  Add a Board
                </Type.p>
              </CardLink>
            </Link>
          </Box>
        </Flex>
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.currentUser,
  username: state.user.currentUser.attrs.username,
});

export default connect(mapStateToProps)(BoardsList);
