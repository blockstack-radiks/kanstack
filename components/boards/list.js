import React from 'react';
import { Text } from 'rebass';
import { Flex, Box } from 'grid-styled';
import Link from 'next/link';

import { Card as CardLink } from '../card';
import { signMessage } from '../../radiks/helpers';

class BoardsList extends React.Component {
  componentDidMount() {
    const signed = signMessage('radiks');
    console.log(signed);
  }

  render() {
    return (
      <Flex flexDirection="row">
        <Box width={1 / 3} mt={4}>
          <Link href="/boards/new" passHref>
            <CardLink>
              <Text textAlign="center">
                Add a Board
              </Text>
            </CardLink>
          </Link>
        </Box>
      </Flex>
    );
  }
}

export default BoardsList;
