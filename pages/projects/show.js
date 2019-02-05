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

class ShowProject extends React.Component {
  static propTypes = {
    groupId: PropTypes.string.isRequired,
  }

  state = {
    users: [],
    userGroup: null,
    isFetching: true,
  }

  static getInitialProps({ query }) {
    console.log(query);
    return {
      groupId: query.id,
    };
  }

  async componentWillMount() {
    const userGroup = await UserGroup.find(this.props.groupId);
    this.setState({ userGroup });
    await this.fetchUsers(userGroup);
    this.setState({ isFetching: false });
  }

  async fetchUsers(userGroup) {
    const { members } = userGroup.attrs;
    const ids = [];
    members.forEach((member) => {
      ids.push({ _id: member.username });
    });
    const users = await User.fetchList({
      $or: ids,
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
    return (
      <>
        <Type.h3 mt={3}>Boards</Type.h3>
        <Flex flexDirection="row">
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
    const project = this.state.userGroup;
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
        {/* {this.state.userGroup ? this.project() : <Loading text="Fetching your project..." /> } */}
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
