import React, { useState } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { authService } from "fbase";
import {
  Link,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Toolbar,
  AppBar,
} from "@mui/material";
import Drawer from "@material-ui/core/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";

const Navigation = ({ isLoggedIn }) => {
  let history = useHistory();
  const onLogOutClick = () => {
    localStorage.clear();
    authService.signOut();
    history.push("/");
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawer, setDrawer] = useState(false);

  const toggleDrawer = () => {
    setDrawer(!drawer);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Kassaboken
          </Typography>
          {isLoggedIn && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <Link
                    underline="hover"
                    color="inherit"
                    component={RouterLink}
                    to="/profile"
                  >
                    Profile
                  </Link>
                </MenuItem>
                <MenuItem onClick={onLogOutClick}>Log out</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>

      <Drawer open={drawer}>
        <MenuItem onClick={toggleDrawer}>
          <Link underline="hover" color="inherit" component={RouterLink} to="/">
            Home
          </Link>
        </MenuItem>
        <MenuItem onClick={toggleDrawer}>
          <Link
            underline="hover"
            color="inherit"
            component={RouterLink}
            to="/cashbook"
          >
            Cashbook
          </Link>
        </MenuItem>
        <MenuItem onClick={toggleDrawer}>
          <Link
            underline="hover"
            color="inherit"
            component={RouterLink}
            to="/calculator"
          >
            Debt and Swish
          </Link>
        </MenuItem>
        <MenuItem onClick={toggleDrawer}>
          <Link
            underline="hover"
            color="inherit"
            component={RouterLink}
            to="/common"
          >
            Common Account
          </Link>
        </MenuItem>
        <MenuItem onClick={toggleDrawer}>
          <Link
            underline="hover"
            color="inherit"
            component={RouterLink}
            to="/addplaces"
          >
            Add places
          </Link>
        </MenuItem>
        <MenuItem onClick={toggleDrawer}>
          <Link
            underline="hover"
            color="inherit"
            component={RouterLink}
            to="/statistics"
          >
            Statistics
          </Link>
        </MenuItem>
      </Drawer>
    </Box>
  );
};

export default Navigation;
