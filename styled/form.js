// import Styled from 'styled-components';
// import { space, width, display } from 'styled-system';
import system from 'system-components';

// const boxProps = `
//   ${space};
//   ${width};
//   ${display};
// `;

// export const Label = Styled.label`
//   ${boxProps};
// `;

export const Label = system({
  is: 'label',
  mt: 3,
  mb: 1,
  display: 'inline-block',
});

export const Select = system({
  is: 'select',
  width: 1,
  py: 2,
  px: 2,
}, () => ({
  appearance: 'none',
  backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAh0lEQVQ4T93TMQrCUAzG8V9x8QziiYSuXdzFC7h4AcELOPQAdXYovZCHEATlgQV5GFTe1ozJlz/kS1IpjKqw3wQBVyy++JI0y1GTe7DCBbMAckeNIQKk/BanALBB+16LtnDELoMcsM/BESDlz2heDR3WePwKSLo5eoxz3z6NNcFD+vu3ij14Aqz/DxGbKB7CAAAAAElFTkSuQmCC')",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 5px center',
}));

// Label.defaultProps = {
//   display: 'inline-block',
// };

// export const Select = Styled.select`
//   ${boxProps};
// `;

// Select.defaultProps = {
//   width: 1,
//   display: 'inline-block',
// };
