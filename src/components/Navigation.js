import React from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { authService } from "fbase";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";

const Navigation = () => {
  let history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };
  return (
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
        to="/statistics"
      >
        Statistics
      </Link>

      <Button onClick={onLogOutClick}>Log out</Button>
    </Breadcrumbs>
  );
};

export default Navigation;
