import React from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { authService } from "fbase";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

const Navigation = () => {
  let history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid item xs={12}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" component={RouterLink} to="/">
            Home
          </Link>

          <Link
            underline="hover"
            color="inherit"
            component={RouterLink}
            to="/cashbook"
          >
            Cashbook
          </Link>

          <Link
            underline="hover"
            color="inherit"
            component={RouterLink}
            to="/calculator"
          >
            Debt and Swish
          </Link>

          <Link
            underline="hover"
            color="inherit"
            component={RouterLink}
            to="/addplaces"
          >
            Add places
          </Link>
          <Link
            underline="hover"
            color="inherit"
            component={RouterLink}
            to="/statistics"
          >
            Statistics
          </Link>

          <Button onClick={onLogOutClick}>Log out</Button>
        </Breadcrumbs>
      </Grid>
    </Box>
  );
};

export default Navigation;
