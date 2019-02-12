import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import Type from '../styled/typography';

const Loading = ({ text }) => (
  <>
    <Type.h1 textAlign="center" mt={4}>
      <FontAwesomeIcon icon={faSpinner} spin size="2x" />
    </Type.h1>
    <Type.p textAlign="center" mt={4}>
      {text || 'Fetching your projects...'}
    </Type.p>
  </>
);

export default Loading;
