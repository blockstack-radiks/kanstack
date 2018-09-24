import Styled, { css } from 'styled-components';
import { width, padding } from 'styled-system';

export const Card = Styled.div`
  ${width}
  ${padding}
  ${({ theme }) => css`
    background: ${theme.colors.black2};
    color: ${theme.colors.lightgray};
    box-shadow: 0 0 2px ${theme.colors.black3};
  `}
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
`;
