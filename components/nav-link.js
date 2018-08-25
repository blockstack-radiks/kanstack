// import Styled from 'styled-components';
import system from 'system-components';

export const NavLink = system({
  is: 'a',
  color: 'inherit',
  bg: 'transparent',
  fontSize: 1,
  fontWeight: 'bold',
  p: 2,
}, () => ({
  display: 'inline-flex',
  alignItems: 'center',
  alignSelf: 'stretch',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  '&:disabled': {
    opacity: 1 / 4,
  },
}), 'width');

NavLink.displayName = 'NavLink';

export default NavLink;
