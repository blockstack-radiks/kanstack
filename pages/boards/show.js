import React from 'react';

import Layout from '../../components/layout';

export default class ShowBoard extends React.Component {
  static getInitialProps({ query }) {
    const boardId = query.id;
    return {
      boardId,
    };
  }

  render() {
    return (
      <Layout>
        hello, board
      </Layout>
    );
  }
}
