import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Flex, Box } from 'grid-styled';
import { loadUserData } from 'blockstack/lib/auth/authApp';
import { decryptECIES, signECDSA } from 'blockstack/lib/encryption';
import Router from 'next/router';

import RadiksActions from 'radiks/lib/redux/actions';
import {
  selectUserGroupsById,
} from 'radiks/lib/redux/selectors';
import { GroupMembership, UserGroup as Project } from 'radiks';

import Head from '../../components/head';
import Nav from '../../components/nav';
import { Card } from '../../components/card';
import Input from '../../components/input';
import Type from '../../styled/typography';
import Button from '../../styled/button';

class NewProject extends React.Component {
  state = {
    name: '',
    projectId: null,
  }

  async componentDidMount() {
    // const membership = new GroupMembership({ id: '6abf1afc-9f2c-4147-bf13-eac8642a6da9' });
    // await membership.fetch();
    // console.log(membership);
  }

  save = async (evt) => {
    evt.preventDefault();
    NProgress.start();
    const project = new Project({
      name: this.state.name,
    });
    // await project.save();
    await project.create();
    Router.push({
      pathname: '/projects/show',
      query: {
        id: project._id,
      },
    }, `/projects/${project._id}`);

    // console.log(project)
    // console.log(project.publicKey());
    // console.log(project);
    // console.log(await project.makeGaiaConfig());
    // const { encryptedGroupPrivateKey } = project;
    // const { appPrivateKey, username } = loadUserData();
    // console.log(decryptECIES(appPrivateKey, encryptedGroupPrivateKey));

    // console.log(await project.makeGroupMembership(username));
    // this.setState({ projectId: project.id });
  }

  render() {
    return (
      <>
        <Head />
        <Nav />
        <Flex>
          <Box width={1 / 2} mx="auto" mt={3}>
            <Card>
              <form onSubmit={this.save}>
                <Type.p fontSize={3} mt={0}>Create a Project</Type.p>
                <Input
                  type="text"
                  mt={3}
                  value={this.state.name}
                  placeholder="Project Name"
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

const mapStateToProps = () => ({
  // projectsById: selectUserGroupsById(state),
});

const mapDispatchToProps = dispatch => bindActionCreators(Object.assign({}, RadiksActions), dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(NewProject);
