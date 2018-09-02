import React from 'react';
import { Container } from 'rebass';

import Head from './head';
import Nav from './nav';

export default ({ children }) => (
  <>
    <Head />
    <Nav />
    <Container pt={4}>
      {children}
    </Container>
  </>
);
