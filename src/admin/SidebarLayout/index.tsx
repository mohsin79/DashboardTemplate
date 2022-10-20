import { FC, ReactNode } from 'react';
import { Box, alpha, lighten, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

interface SidebarLayoutProps {
  children?: ReactNode;
}

const SidebarLayout: FC<SidebarLayoutProps> = () => {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          flex: 1,
          height: '100%',

          '.MuiPageTitle-wrapper': {
            background: alpha("#ffffff", 0.5),
            marginBottom: "36px",
            boxShadow: `0px 2px 4px -3px ${alpha("#223354", 0.1)}, 0px 5px 12px -4px ${alpha("#223354", 0.05)}`
          }
        }}
        className="sidebarViewMainContainer"
      >
        <Header />
        <Sidebar />
        <Box
          className='adminMainContentContainer'
          sx={{
            position: 'relative',
            zIndex: 5,
            display: 'block',
            flex: 1,
            pt: `80px`,
            height: "100%",
            background: "#f2f5f9",
            // [theme.breakpoints.up('lg')]: {
            //   ml: `${theme.sidebar.width}`
            // }
          }}
        >
          <Box display="block">
            <Outlet />
          </Box>
          <Footer />
        </Box>
      </Box>
    </>
  );
};

export default SidebarLayout;
