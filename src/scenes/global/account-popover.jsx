//import { useCallback } from 'react';
//import { useRouter } from 'next/navigation';
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

import PropTypes from 'prop-types';
import { Box, Divider, MenuItem, MenuList, Popover, Typography } from '@mui/material';
//import { useAuth } from '../../hooks/use-auth';

import {AuthContext } from "../../mycontext/AuthContext";


export const AccountPopover = (props) => {
  const { anchorEl, onClose, open } = props;

  const navigate = useNavigate();
  //const router = useRouter();
  //const auth = useAuth();
   /*
  const handleSignOut = useCallback(
    () => {
      onClose?.();
      auth.signOut();
      //router.push('/auth/login');
    },
    [onClose, auth]
  );
  */
  const { name,logouth} = useContext(AuthContext);



  const handleSignOut = ()=>{
     console.log("logout");
     //setIsLogin(false);
     logouth();
     //router.push('/auth/login');
     navigate("/auth/login");
  };
  
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom'
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 200 } }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2
        }}s

      >
        <Typography variant="overline">
          Account
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {name}
        </Typography>
      </Box>
      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: '8px',
          '& > *': {
            borderRadius: 1
          }
        }}
      >
        <MenuItem onClick={handleSignOut}>
          Sign out
        </MenuItem>
      </MenuList>
    </Popover>
    
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};
