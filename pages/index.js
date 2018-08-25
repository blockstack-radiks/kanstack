import React from 'react';
import Link from 'next/link';
import { Container } from 'rebass';

import Head from '../components/head';
import Nav from '../components/nav';
import Login from '../components/login';

const Home = () => (
  <div>
    <Head title="Home" />
    <Nav />
    <Container>
      <Login />
    </Container>
  </div>
);

export default Home;
