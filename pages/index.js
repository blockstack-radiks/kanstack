import React from 'react';
// import Link from 'next/link';
import { Container } from 'rebass';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as blockstack from 'blockstack';
import { connectToGaiaHub, uploadToGaiaHub } from 'blockstack/lib/storage/hub';

import Head from '../components/head';
import Nav from '../components/nav';
import Login from '../components/login';
import BoardsList from '../components/boards/list';

import UserActions from '../stores/user/actions';

class Home extends React.Component {
  async componentDidMount() {
    this.props.handleLogIn();
    const userData = blockstack.loadUserData();
    const hubUrl = 'http://localhost:4242'; // my local gaia hub
    const { appPrivateKey } = userData;
    const scopes = [
      {
        scope: 'putFilePrefix',
        domain: 'testingScoped',
      },
    ];
    const gaiaConfig = await connectToGaiaHub(hubUrl, appPrivateKey, scopes);
    try {
      await uploadToGaiaHub('shouldnt-work', 'asdf', gaiaConfig);
    } catch (error) {
      console.log('Correctly failed to upload');
    }
    await uploadToGaiaHub('testingScoped/should-work', 'asdf', gaiaConfig);
    console.log('Write was successful');
  }

  render() {
    const { currentUser } = this.props;
    return (
      <div>
        <Head title="Home" />
        <Nav />
        <Container>
          {currentUser ? (
            <BoardsList />
          ) : (
            <Login />
          )}
        </Container>
      </div>
    );
  }
}

Home.propTypes = {
  currentUser: PropTypes.object,
  handleLogIn: PropTypes.func.isRequired,
};

Home.defaultProps = {
  currentUser: null,
};

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
});

const mapDispatchToProps = dispatch => bindActionCreators(Object.assign({}, UserActions), dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
