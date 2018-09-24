import React from 'react';
import { Container } from 'rebass';
import PropTypes from 'prop-types';

import Head from './head';
import Nav from './nav';
import { Body } from '../styled/layout';

const Layout = ({ children, useContainer = true }) => (
  <>
    <Head />
    <Nav />
    <Body id="body">
      {useContainer ? (
        <Container pt={4}>
          {children}
        </Container>
      ) : (
        <>
          {children}
        </>
      )}
    </Body>
  </>
);

Layout.propTypes = {
  useContainer: PropTypes.bool,
};

Layout.defaultProps = {
  useContainer: true,
};

export default Layout;
