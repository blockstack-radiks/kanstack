import sys from 'system-components';

export const Card = sys({
  borderRadius: 3,
  width: 1,
  bg: 'white',
  p: 2,
  fontSize: '12px',
  border: '1px solid rgba(0,0,0,0.3)',
  my: 2,
}, () => ({
  boxSizing: 'border-box',
}));
