import sys from 'system-components';

export const Card = sys({
  borderRadius: 3,
  width: 1,
  p: 3,
  fontSize: '16px',
  my: 2,
  fontWeight: '300',
}, props => ({
  boxSizing: 'border-box',
  color: props.theme.colors.lightgray,
  backgroundColor: props.theme.colors.darkest,
  // border: `1px solid ${props.theme.colors.gray}`,
  // border: '1px solid black',
  boxShadow: `0 0 2px ${props.theme.colors.black3}`,
}));
