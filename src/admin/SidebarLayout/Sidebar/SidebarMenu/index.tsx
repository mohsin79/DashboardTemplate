import { useContext } from 'react';
// import { alpha, createTheme, lighten, darken } from '@mui/material';

import {
  ListSubheader,
  alpha,
  Box,
  List,
  styled,
  Button,
  ListItem
} from '@mui/material';
import { NavLink as RouterLink } from 'react-router-dom';
import { SidebarContext } from '../../../contexts/SidebarContext';

import DashboardIcon from '@mui/icons-material/Dashboard';
import AppsIcon from '@mui/icons-material/Apps';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import BookIcon from '@mui/icons-material/Book';
import SettingsIcon from '@mui/icons-material/Settings';

const MenuWrapper = styled(Box)(
  () => `
  .MuiList-root {
    padding: 9px;

    & > .MuiList-root {
      padding: 0 0 9px;
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: 0.75rem;
      color: ${alpha("#ffffff", 0.5)};
      padding: 0 22.5px;
      line-height: 1.4;
    }
`
);

const SubMenuWrapper = styled(Box)(
  () => `
    .MuiList-root {

      .MuiListItem-root {
        padding: 1px 0;

        .MuiBadge-root {
          position: absolute;
          right: 28.8px;

          .MuiBadge-standard {
            background: #5569ff;
            font-size: 0.625rem;
            font-weight: bold;
            text-transform: uppercase;
            color: #ffffff;
          }
        }
    
        .MuiButton-root {
          display: flex;
          color: ${alpha("#ffffff", 0.7)};
          background-color: transparent;
          width: 100%;
          justify-content: flex-start;
          padding: 10.8px 27px;

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: color all 0.3s ease;

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            color: ${alpha("#ffffff", 0.3)};
            font-size: 1.25rem;
            margin-right: 9px;
          }
          
          .MuiButton-endIcon {
            color: ${alpha("#ffffff", 0.5)};
            margin-left: auto;
            opacity: .8;
            font-size: 1.25rem;
          }

          &.active,
          &:hover {
            background-color: ${alpha("#ffffff", 0.06)};
            color: #ffffff;

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: #ffffff;
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: 63px;
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: 9px 0;
          }

          .MuiListItem-root {
            padding: 1px 0;

            .MuiButton-root {
              padding: 7.2px 27px;

              .MuiBadge-root {
                right: 28.8px;
              }

              &:before {
                content: ' ';
                background: #ffffff;
                opacity: 0;
                transition: 
                  'transform all 0.3s ease',
                  'opacity all 0.3s ease';
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: 16.2px;
              }

              &.active,
              &:hover {

                &:before {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
`
);

function SidebarMenu() {
  const { closeSidebar } = useContext(SidebarContext);

  return (
    <>
      <MenuWrapper>
        <List component="div">
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <Button
                  component={RouterLink}
                  to="/admin/dashboard"
                  startIcon={<DashboardIcon />}
                >
                  Dashboard
                </Button>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>
        <List component="div">
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <Button
                  component={RouterLink}
                  to="/admin/application"
                  startIcon={<AppsIcon />}
                >
                  Application
                </Button>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>
        <List component="div">
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <Button
                  component={RouterLink}
                  to="/admin/userlist"
                  startIcon={<ManageAccountsIcon />}
                >
                  User Management
                </Button>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>
        <List component="div">
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <Button
                  component={RouterLink}
                  to="/"
                  startIcon={<BookIcon />}
                >
                  Audit / logs
                </Button>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>
        <List component="div">
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <Button
                  component={RouterLink}
                  to="/"
                  startIcon={<SettingsIcon />}
                >
                  Settings
                </Button>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>
      </MenuWrapper>
    </>
  );
}

export default SidebarMenu;
