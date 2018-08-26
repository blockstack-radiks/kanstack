import React from 'react';
import { Flex, Box, Text } from 'rebass';

import Head from '../../components/head';
import Nav from '../../components/nav';
import Card from '../../components/card';

class NewBoard extends React.Component {
  render() {
    return (
      <>
        <Head />
        <Nav />
        <Flex>
          <Box width={1 / 2} mx="auto" mt={3}>
            <Card>
              <Text textAlign="center">
                <Text fontSize={3}>Create a Board</Text>
              </Text>
            </Card>
          </Box>
        </Flex>
      </>
    );
  }
}

export default NewBoard;
