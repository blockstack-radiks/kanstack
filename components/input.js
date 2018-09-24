import Styled, { css } from 'styled-components';
import { space, width } from 'styled-system';

const Input = Styled.input`
  ${space};
  ${width};
  border-radius: 3px;
  border: 1px solid #cccccc;
  box-sizing: border-box;
  padding-left: 10px;
  display: inline-block;
  ${({ theme }) => css`
    background-color: ${theme.colors.dark};
    color: ${theme.colors.lightgray};
    border: 1px solid ${theme.colors.black3};
  `}
`;

Input.defaultProps = {
  px: 1,
  py: 2,
  width: 1,
};

export default Input;
