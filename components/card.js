import Styled from 'styled-components';
import { width, padding } from 'styled-system';

export const Card = Styled.div`
  ${width}
  ${padding}
  box-shadow: 0 0 2px gray;
  border-radius: 2px;
  padding: 10px 15px;
`;

Card.defaultProps = {
  p: 2,
};

export default Card;

export const CardLink = Styled(Card.withComponent('a'))`
  text-decoration: none;
  display: block;
  color: black;
`;
