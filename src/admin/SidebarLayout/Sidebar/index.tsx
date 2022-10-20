import { useContext } from 'react';
import Scrollbar from '../../../components/Scrollbar';
import { SidebarContext } from '../../contexts/SidebarContext';

import {
  Box,
  Drawer,
  alpha,
  styled,
  Divider,
  useTheme,
  Button,
  lighten,
  darken,
  Tooltip
} from '@mui/material';

import SidebarMenu from './SidebarMenu';
import Logo from "../../../components/Logo"

const SidebarWrapper = styled(Box)(
  () => `
        width: 290px;
        min-width: 290px;
        color: ${alpha('#ffffff', 0.7)};
        position: relative;
        z-index: 7;
        height: 100%;
        padding-bottom: 68px;
`
);

function Sidebar() {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const closeSidebar = () => toggleSidebar();
  // const theme = useTheme();

  return (
    <>
      <SidebarWrapper
        sx={{
          display: {
            xs: 'none',
            lg: 'inline-block'
          },
          position: 'fixed',
          left: 0,
          top: 0,
          background: darken("#223354", 0.5),
          boxShadow: 'none'
        }}
      >
        <Scrollbar>
          <Box mt={3}>
            <Box
              mx={2}
              sx={{
                width: "100%"
              }}
            >
              <Logo />
            </Box>
          </Box>
          <Divider
            sx={{
              mt: "27px",
              mx: "18px",
              background: alpha("#ffffff", 0.1)
            }}
          />
          <SidebarMenu />
        </Scrollbar>
        <Divider
          sx={{
            background: alpha("#ffffff", 0.1)
          }}
        />
        {/* <Box p={2}>
          <Button
            href="https://bloomui.com"
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            color="warning"
            size="small"
            fullWidth
          >
            Upgrade to PRO
          </Button>
        </Box> */}
      </SidebarWrapper>
      <Drawer
        sx={{
          boxShadow: '2px 0 3px rgba(159, 162, 191, .18), 1px 0 1px rgba(159, 162, 191, 0.32)'
        }}
        anchor={'left'}
        open={sidebarToggle}
        onClose={closeSidebar}
        variant="temporary"
        elevation={9}
      >
        <SidebarWrapper
          sx={{
            background: darken("#223354", 0.5)
          }}
        >
          <Scrollbar>
            <Box mt={3}>
              <Box
                mx={2}
                sx={{
                  width: "100%"
                }}
              >
                <Logo />
              </Box>
            </Box>
            <Divider
              sx={{
                mt: "27px",
                mx: "18px",
                background: alpha("#ffffff",0.1)
              }}
            />
            <SidebarMenu />
          </Scrollbar>
        </SidebarWrapper>
      </Drawer>
    </>
  );
}

export default Sidebar;
