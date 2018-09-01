import Styled from 'styled-components';
// import { Box } from 'rebass';
import { width } from 'styled-system';
// import sys from 'system-components';

// export const Card = sys({
//   p: 2,
//   bg: 'white',
//   borderRadius: 2,
//   boxShadow: '0 0 2px gray',
// }, {
//   overflow: 'hidden',
// }, 'space', 'color');

// Card.displayName = 'Card';

export const Card = Styled.div`
  ${width}
  box-shadow: 0 0 2px gray;
  border-radius: 2px;
  padding: 10px 15px;
`;

export default Card;

export const CardLink = Styled(Card.withComponent('a'))`
  text-decoration: none;
  display: block;
  text-align: center;
  color: black;
  width: 100%;
`;
