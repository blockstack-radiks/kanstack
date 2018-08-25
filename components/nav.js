import React from 'react';
import Link from 'next/link';
import { Toolbar, NavLink } from 'rebass';

// import { NavLink } from './nav-link';

const Nav = () => (
  <Toolbar>
    <Link href="/" passHref>
      <NavLink>Kanstack</NavLink>
    </Link>
  </Toolbar>
);

export default Nav;
