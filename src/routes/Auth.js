import { authService, firebaseInstance } from "fbase";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

const Auth = () => {
  const onSocialClick = async (event) => {
    await authService.signInWithPopup(
      new firebaseInstance.auth.GoogleAuthProvider()
    );
  };

  return (
    <Box sx={{ m: 2 }} justifyContent="center" alignItems="center">
      <Paper sx={{ p: 2 }}>
        <Typography variant="h3" component="div">
          Welcome!
        </Typography>

        <Typography variant="body1" component="div">
          You need to sign in to use Kassaboken.
        </Typography>

        <p />
        <Button variant="outlined" onClick={onSocialClick}>
          <Typography variant="button" component="div">
            Log in with Google account
          </Typography>
        </Button>
      </Paper>
    </Box>
  );
};

export default Auth;
