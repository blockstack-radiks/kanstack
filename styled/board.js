import Styled, { css } from 'styled-components';
import { space, width } from 'styled-system';

export const Header = Styled.div`
  width: 100%;
  padding: 5px 10px;
  // background-color: #EFEFEF;
  ${({ theme }) => css`
    background-color: ${theme.colors.black3};
    color: ${theme.colors.lightgray};
  `}
  box-sizing: border-box;
  h1 {
    font-size: 36px;
    margin: 0;
    padding: 0;
    font-weight: 400;
  }
`;

export const ListHeader = Styled.div`
  width: 100%;
  font-size: 18px;
  text-align: center;
  padding: 5px 0;
  ${({ theme, last }) => css`
    background-color: ${theme.colors.black2};
    border-right: ${last ? 'none' : `1px solid ${theme.colors.black3}`};
    border-bottom: 1px solid ${theme.colors.black3};
  `}
  color: ${props => props.color};
  font-weight: 800;
  box-sizing: border-box;
`;

export const AddCardButton = Styled.span`
  text-align: right;
  background: ${({ theme }) => theme.colors.darkest};
  border-radius: 50%;
  float: right;
  width: 35px;
  height: 30px;
  position: relative;
  right: 20px;
  font-size: 20px;
  top: 2px;
  text-align: center;
  padding-top: 5px;
  // border: 1px solid ${({ theme }) => theme.colors.lightgray};
  box-shadow: 0 0 3px ${({ theme }) => theme.colors.lightgray};
  cursor: pointer;
  transition: all 0.2s;
  transition-property: box-shadow, transform;
  &:hover {
    // box-shadow: 0 0 5px rgba(0,0,0,0.5);
    transform: scale(1.1);
  }
  svg {
    fill: ${({ theme }) => theme.colors.lightgray};
  }
`;
