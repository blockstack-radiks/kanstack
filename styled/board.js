import Styled from 'styled-components';

export const Header = Styled.div`
  width: 100%;
  padding: 5px 10px;
  background-color: #EFEFEF;
  box-sizing: border-box;
  h1 {
    font-size: 36px;
    margin: 0;
    padding: 0;
  }
`;

export const ListHeader = Styled.div`
  width: 100%;
  font-size: 18px;
  text-align: center;
  padding: 5px 0;
  background-color: ${props => props.bg};
`;

export const AddCardButton = Styled.span`
  text-align: right;
  background: white;
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
  border: 1px solid gray;
  cursor: pointer;
  transition: all 0.2s;
  transition-property: box-shadow, transform;
  &:hover {
    box-shadow: 0 0 5px rgba(0,0,0,0.5);
    transform: scale(1.1);
  }
  svg {
    fill: white;
  }
`;
