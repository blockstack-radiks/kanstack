import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { User } from 'radiks';
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
    fetchUserGroup: PropTypes.func.isRequired,
    groupId: PropTypes.string.isRequired,
    userGroup: PropTypes.object,
    isFetching: PropTypes.bool,
  }

  static defaultProps = {
    userGroup: null,
    isFetching: true,
  }

  state = {
    users: [],
  }

  static getInitialProps({ query }) {
    return {
      groupId: query.id,
    };
  }

  componentDidMount() {
    this.props.fetchUserGroup(this.props.groupId);
  }

  async componentWillReceiveProps(nextProps) {
    if (!this.props.userGroup && nextProps.userGroup) {
      this.fetchUsers(nextProps);
    }
  }

  async fetchUsers(nextProps) {
    const { members } = nextProps.userGroup.attrs;
    const ids = [];
    members.forEach((member) => {
      ids.push({ _id: member.username });
    });
    const users = await User.fetchList({
      $or: ids,
    }, {}, { decrypt: false });
    this.setState({ users });
  }

  // async fetchBoards()

  users() {
    const { users } = this.state;
    return users.map(user => (
      <Box width={1 / 3} my={2} key={user.id}>
        <Card textAlign="center">
          {user.id}
        </Card>
      </Box>
    ));
  }

  boards() {
    return (
      <>
        <Type.h3 mt={3}>Boards</Type.h3>
        <Flex flexDirection="row">
          <Box width={[1 / 3]} my={2}>
            <Link
              passHref
              href={{
                pathname: '/boards/new',
                query: { groupId: this.props.groupId },
              }}
            >
              <CardLink>
                New Board
              </CardLink>
            </Link>
          </Box>
        </Flex>
      </>
    );
  }

  project() {
    const project = this.props.userGroup;
    return (
      <>
        <Type.h2>{project.attrs.name}</Type.h2>
        {this.boards()}
        <Type.h3 mt={3}>Users</Type.h3>
        <Flex flexDirection="row">
          {this.users()}
        </Flex>
      </>
    );
  }

  render() {
    return (
      <Layout>
        {this.props.userGroup ? this.project() : <Loading text="Fetching your project..." /> }
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
