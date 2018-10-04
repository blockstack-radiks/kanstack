import Styled, { css } from 'styled-components';
import { width, space } from 'styled-system';

export const Card = Styled.div`
  ${width}
  ${space}
  ${({ theme }) => css`
    background: ${theme.colors.black2};
    color: ${theme.colors.lightgray};
    box-shadow: 0 0 2px ${theme.colors.black3};
  `}
  border-radius: 2px;
  text-align: ${({ textAlign }) => textAlign || 'left'};
`;

Card.defaultProps = {
  p: 3,
};

export default Card;

export const CardLink = Styled(Card.withComponent('a'))`
  text-decoration: none;
  display: block;
`;
