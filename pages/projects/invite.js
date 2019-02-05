import React from 'react';
import { User } from 'radiks';
import { Flex, Box } from 'grid-styled';

import Layout from '../../components/layout';
import Type from '../../styled/typography';
import { Card } from '../../components/card';
import Input from '../../components/input';
import Button from '../../styled/button';

export default class ProjectInvite extends React.Component {
  static getInitialProps({ query }) {
    return {
      groupId: query.groupId,
    };
  }

  state = {
    userResults: [],
    query: '',
    selectedUserId: null,
  }

  search = async (username) => {
    NProgress.start();
    const userResults = await User.fetchList({
      username: {
        $regex: username,
      },
    });
    console.log(userResults);
    NProgress.done();
    this.setState({ userResults });
  }

  users() {
    return this.state.userResults.map(user => (
      <Flex key={user._id} mt={1}>
        <Box width={3 / 4} pt={2}>
          {user.attrs.username}
        </Box>
        <Box width={1 / 4}>
          <Button width={1} display="block">Invite</Button>
        </Box>
      </Flex>
    ));
  }

  results() {
    if (this.state.userResults.length === 0) {
      return '';
    }
    return (
      <>
        <Type.p fontSize={2} mt={3} mb={1}>
          Results
        </Type.p>
        {this.users()}
      </>
    );
  }

  render() {
    return (
      <Layout>
        <Flex>
          <Box width={1 / 2} mx="auto" mt={3}>
            <Card>
              <Type.p fontSize={3} mt={0} mb={2}>Invite a User</Type.p>
              <form onSubmit={(evt) => {
                evt.preventDefault();
                this.search(this.state.query);
              }}
              >
                <Input
                  type="text"
                  mt={2}
                  value={this.state.query}
                  placeholder="Search by username"
                  onChange={evt => this.setState({ query: evt.target.value })}
                />
                <Button mt={2} d="block" width="100%">Submit</Button>
              </form>
              {this.results()}
            </Card>
          </Box>
        </Flex>
      </Layout>
    );
  }
}
