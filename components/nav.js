import React from 'react';
import Link from 'next/link';
import { withRouter } from 'next/router';
import { Toolbar, NavLink } from 'rebass';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import UserActions from '../stores/user/actions';

// import { NavLink } from './nav-link';

const Nav = ({ currentUser, logout, router }) => (
  <Toolbar>
    <Link href="/" passHref>
      <NavLink>Kanstack</NavLink>
    </Link>
    {currentUser && (
      <>
        <Link href="/projects" passHref>
          <NavLink ml="auto" mr={1}>Projects</NavLink>
        </Link>
        <NavLink
          // ml="auto"
          // href="#"
          onClick={() => {
            logout();
            router.push('/');
          }}
        >
          Logout
        </NavLink>
      </>
    )}
  </Toolbar>
);

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
});

const mapDispatchToProps = dispatch => bindActionCreators(Object.assign({}, UserActions), dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Nav));
