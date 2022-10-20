import { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars-2';

import { alpha, Box, useTheme } from '@mui/material';

interface ScrollbarProps {
  className?: string;
  children?: ReactNode;
}

const Scrollbar: FC<ScrollbarProps> = ({ className, children, ...rest }) => {
  const theme = useTheme();

  return (
    <Scrollbars
      autoHide
      renderThumbVertical={() => {
        return (
          <Box
            sx={{
              width: 5,
              background: `${alpha("#223354",0.1)}`,
              borderRadius: '12px',
              transition: 'background',

              '&:hover': {
                background: `${alpha("#223354",0.3)}`
              }
            }}
          />
        );
      }}
      {...rest}
    >
      {children}
    </Scrollbars>
  );
};

Scrollbar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default Scrollbar;
