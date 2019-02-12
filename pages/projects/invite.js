import React from 'react';
import { User } from 'radiks';
import { Flex, Box } from 'grid-styled';

import Layout from '../../components/layout';
import Type from '../../styled/typography';
import { Card } from '../../components/card';
import Input from '../../components/input';
import Button from '../../styled/button';

import Project from '../../models/project';

export default class ProjectInvite extends React.Component {
  static getInitialProps({ query }) {
    return {
      id: query.id,
    };
  }

  state = {
    userResults: [],
    query: '',
    invitation: null,
  }

  // async componentDidMount() {
  //   const { id } = this.props;
  //   const project = await Project.find(id);
  // }

  search = async (username) => {
    NProgress.start();
    const userResults = await User.fetchList({
      username: {
        $regex: username,
      },
    }, { decrypt: false });
    console.log(userResults);
    NProgress.done();
    this.setState({ userResults });
  }

  async sendInvite(username) {
    NProgress.start();
    const { id } = this.props;
    const project = await Project.find(id);
    window.project = project;
    const invitation = await project.makeGroupMembership(username);
    this.setState({ invitation }, () => {
      NProgress.done();
    });
  }

  users() {
    return this.state.userResults.map(user => (
      <Flex key={user._id} mt={1}>
        <Box width={3 / 4} pt={2}>
          {user.attrs.username}
        </Box>
        <Box width={1 / 4}>
          <Button width={1} display="block" onClick={() => this.sendInvite(user.attrs.username)}>Invite</Button>
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

  inviteLink() {
    const { invitation } = this.state;
    if (!invitation) {
      return null;
    }
    const url = `${document.location.origin}/activate-invite/${invitation._id}`;
    return (
      <p>
        Send this link to accept the invite:
        <br />
        <Input
          type="text"
          mt={2}
          value={url}
          disabled
        />
      </p>
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
              {this.inviteLink()}
            </Card>
          </Box>
        </Flex>
      </Layout>
    );
  }
}
