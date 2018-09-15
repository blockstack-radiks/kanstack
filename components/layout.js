import React from 'react';
import { Container } from 'rebass';
import PropTypes from 'prop-types';

import Head from './head';
import Nav from './nav';

const Layout = ({ children, useContainer = true }) => (
  <>
    <Head />
    <Nav />
    { useContainer ? (
      <Container pt={4}>
        {children}
      </Container>
    ) : (
      <>
        {children}
      </>
    )}
  </>
);

Layout.propTypes = {
  useContainer: PropTypes.bool,
};

Layout.defaultProps = {
  useContainer: true,
};

export default Layout;
