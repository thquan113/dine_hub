import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const DishPlusSvg: React.FC = () => {
  return (
    <Svg width={14} height={14} fill='none'>
      <Path
        stroke='#0C1D2E'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.2}
        d='M6.955 2.917v8.166M2.898 7h8.114'
      />
    </Svg>
  );
};

export default DishPlusSvg;
