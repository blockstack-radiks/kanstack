import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { User, UserGroup } from 'radiks';
import { Flex, Box } from 'grid-styled';
import Link from 'next/link';

import RadiksActions from 'radiks/lib/redux/actions';
import { selectUserGroupsById } from 'radiks/lib/redux/selectors';

import Layout from '../../components/layout';
import Type from '../../styled/typography';
import Loading from '../../components/loading';
import Card, { CardLink } from '../../components/card';
import Project from '../../models/project';
import Board from '../../models/board';

class ShowProject extends React.Component {
  static propTypes = {
    groupId: PropTypes.string.isRequired,
  }

  state = {
    users: [],
    project: null,
    boards: [],
    isFetching: true,
  }

  static getInitialProps({ query }) {
    console.log(query);
    return {
      groupId: query.id,
    };
  }

  async componentDidMount() {
    const project = await Project.find(this.props.groupId);
    const boards = await Board.fetchList({ userGroupId: project._id });
    await this.fetchUsers(project);
    this.setState({
      project,
      boards,
      isFetching: false,
    });
  }

  async fetchUsers(project) {
    const { members } = project.attrs;
    const ids = members.map(member => member.username);
    // members.forEach((member) => {
    //   ids.push({ _id: member.username });
    // });
    const users = await User.fetchList({
      _id: ids.join(','),
    }, {}, { decrypt: false });
    this.setState({ users });
  }

  users() {
    const { users } = this.state;
    return users.map(user => (
      <Box width={1 / 3} my={2} key={user._id} mx={3}>
        <Card textAlign="center">
          {user._id}
        </Card>
      </Box>
    ));
  }

  boards() {
    const { boards } = this.state;
    return (
      <>
        <Type.h3 mt={3}>Boards</Type.h3>
        <Flex flexDirection="row">
          {boards.map(board => (
            <Box width={[1 / 3]} my={2} mx={3} key={board._id}>
              <Link
                passHref
                href={{
                  pathname: '/boards/show',
                  query: { id: board._id },
                }}
                as={`/boards/${board._id}`}
              >
                <CardLink textAlign="center">
                  {board.attrs.name}
                </CardLink>
              </Link>
            </Box>
          ))}
          <Box width={[1 / 3]} my={2} mx={3}>
            <Link
              passHref
              href={{
                pathname: '/boards/new',
                query: { groupId: this.props.groupId },
              }}
            >
              <CardLink textAlign="center">
                New Board
              </CardLink>
            </Link>
          </Box>
        </Flex>
      </>
    );
  }

  project() {
    const { project } = this.state;
    return (
      <>
        <Type.h2>{project.attrs.name}</Type.h2>
        {this.boards()}
        <Type.h3 mt={3}>Users</Type.h3>
        <Flex flexDirection="row">
          {this.users()}
          <Box width={1 / 3} my={2} mx={3}>
            <Link
              passHref
              href={{
                pathname: '/projects/invite',
                query: { id: this.props.groupId },
              }}
              as={`/projects/${this.props.groupId}/invite`}
            >
              <CardLink textAlign="center">
                Invite a User
              </CardLink>
            </Link>
          </Box>
        </Flex>
      </>
    );
  }

  render() {
    return (
      <Layout>
        {/* {this.state.project ? this.project() : <Loading text="Fetching your project..." /> } */}
        {this.state.isFetching ? <Loading text="Fetching your project..." /> : this.project() }
      </Layout>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const userGroups = selectUserGroupsById(state);
  const { isFetching } = state.radiks.userGroups;
  let userGroup;
  if (userGroups) {
    userGroup = userGroups[ownProps.groupId];
  }

  return {
    userGroup,
    isFetching,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators(Object.assign({}, RadiksActions), dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ShowProject);
