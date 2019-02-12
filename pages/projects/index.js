import React from 'react';
import { Flex, Box } from 'grid-styled';
import { Container } from 'rebass';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Link from 'next/link';
import PropTypes from 'prop-types';

import RadiksActions from 'radiks/lib/redux/actions';
import {
  selectUserGroupsById,
} from 'radiks/lib/redux/selectors';
import Project from '../../models/project';

import Head from '../../components/head';
import Nav from '../../components/nav';
import { CardLink } from '../../components/card';
import Type from '../../styled/typography';
import Loading from '../../components/loading';

class Projects extends React.Component {
  static propTypes = {
    fetchUserGroups: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
    projects: PropTypes.object.isRequired,
  }

  state = {
    projects: null,
  }

  async componentDidMount() {
    // this.props.fetchUserGroups();
    const projects = await Project.myGroups();
    this.setState({
      projects,
    });
  }

  loading = () => (<Loading text="Fetching your projects..." />)

  projects() {
    const { projects } = this.state;
    return Object.values(projects).map(project => (
      <Box width={1 / 3} mt={4} key={project._id} mx={3}>
        <Link href={`/projects/${project._id}`} passHref>
          <CardLink>
            <Type.p my={1} p={0} textAlign="center">
              {project.attrs.name}
            </Type.p>
          </CardLink>
        </Link>
      </Box>
    ));
  }

  render() {
    const { projects } = this.state;
    return (
      <>
        <Head />
        <Nav />
        <Container>
          <Type.h1>Your Projects</Type.h1>
          {!projects ? this.loading() : (
            <Flex flexDirection="row">
              {this.projects()}
              <Box width={1 / 3} mt={4}>
                <Link href="/projects/new" passHref>
                  <CardLink>
                    <Type.p my={1} p={0} textAlign="center">
                      Add a Project
                    </Type.p>
                  </CardLink>
                </Link>
              </Box>
            </Flex>
          )}

        </Container>
      </>
    );
  }
}

const mapStateToProps = state => ({
  projects: selectUserGroupsById(state),
  isFetching: state.radiks.userGroups.isFetching,
});

const mapDispatchToProps = dispatch => bindActionCreators(Object.assign({}, RadiksActions), dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
