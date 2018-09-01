import React from 'react';
// import Link from 'next/link';
import { Container } from 'rebass';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import Head from '../components/head';
import Nav from '../components/nav';
import Login from '../components/login';
import BoardsList from '../components/boards/list';

import UserActions from '../stores/user/actions';

class Home extends React.Component {
  componentDidMount() {
    this.props.handleLogIn();
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
