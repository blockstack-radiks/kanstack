import React from 'react';
import { GroupInvitation } from 'radiks';
import Router from 'next/router';

import Loading from '../../components/loading';

export default class ActivateInvite extends React.Component {
  static getInitialProps({ query }) {
    return {
      id: query.id,
    };
  }

  async componentDidMount() {
    const { id } = this.props;
    const invite = await GroupInvitation.findById(id, { decrypt: true });
    console.log(invite);
    const membership = await invite.activate();
    console.log(membership);
    Router.push({
      pathname: '/projects',
      query: {
        id: invite.attrs.userGroupId,
      },
    }, `/projects/${invite.attrs.userGroupId}`);
  }

  render() {
    return (
      <Loading text="Activating your invite..." />
    );
  }
}
