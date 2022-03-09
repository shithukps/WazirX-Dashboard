import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import history from '../../../utils/history';
import { logoutStatus } from '../../../constants/globalconstants';

function onLogout() {
  logoutStatus.done = true;
  history.replace({
    pathname: '/'
  });
}
export const menuListItems = (
  <div>
    <ListItem button onClick={onLogout}>
      <ListItemIcon>
        <LogoutIcon />
      </ListItemIcon>
      <ListItemText primary="Log Out" />
    </ListItem>
  </div>
);