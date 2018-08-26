import App, { Container } from 'next/app';
import React from 'react';
import { withRouter } from 'next/router';
import { Provider } from 'react-redux';

import { ThemeProvider } from 'styled-components';
import withReduxStore from '../lib/with-redux-store';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    /**
     * Pass down cookies from server to each page
     */
    const cookies = ctx.req && ctx.req.universalCookies && ctx.req.universalCookies.cookies;

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps, cookies };
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props;

    return (
      <ThemeProvider theme={{}}>
        <Container>
          <Provider store={reduxStore}>
            <Component {...pageProps} serverCookies={this.props.cookies} />
          </Provider>
        </Container>
      </ThemeProvider>
    );
  }
}

export default withRouter(withReduxStore(MyApp));
