import React from 'react';
import {
  Box, Flex, Button, Text,
} from 'rebass';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import UserActions from '../stores/user/actions';

const Login = ({ login }) => (
  <div>
    <Flex mt={4} alignItems="center">
      <Box width={1}>
        <Text textAlign="center">
          To get started, login with Blockstack.
        </Text>
        <Button onClick={() => login()} mx="auto" style={{ display: 'block' }} mt={4}>
          Sign in with Blockstack
        </Button>
      </Box>
    </Flex>
  </div>
);

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
});

const mapDispatchToProps = dispatch => bindActionCreators(Object.assign({}, UserActions), dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Login);
