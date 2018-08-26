import React from 'react';
import { Flex, Box, Text } from 'rebass';
import Link from 'next/link';

import Card from '../card';

class BoardsList extends React.Component {
  render() {
    return (
      <Flex>
        <Box width={1 / 3} mt={4}>
          <Link href="/boards/new">
            <Card>
              <Text textAlign="center">
                <Link href="/boards/new">
                  <a>Add a Board</a>
                </Link>
              </Text>
            </Card>
          </Link>
        </Box>
      </Flex>
    );
  }
}

export default BoardsList;
