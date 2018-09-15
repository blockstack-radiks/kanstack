import Styled from 'styled-components';

export const Header = Styled.div`
  width: 100%;
  padding: 5px 10px;
  background-color: #EFEFEF;
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
