import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { authService } from "fbase";

const Home = () => {
  var isAdmin = JSON.parse(window.localStorage.getItem("isAdmin"));
  var user = authService.currentUser.displayName;

  return isAdmin ? (
    <Box sx={{ m: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h3" gutterBottom component="div">
          Hello, {user}!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Welcome to Kassaboken ADMIN! <p />
          This is a cashbook program for Yoonjoo and Erik. If you are not one of
          us but seeing this page, please tell Yoonjoo so that the login problem
          can be fixed.
        </Typography>
      </Paper>
    </Box>
  ) : (
    <Box sx={{ m: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h3" gutterBottom component="div">
          Hello, {user}!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Welcome to Kassaboken Guest! <p />
          <p /> You are visiting as a guest. Feel free to browse this cashbook!
          You can change/add/delete anything.
          <p /> If you find some errors or have suggestion, please contact
          Yoonjoo.
          <p /> Enjoy!
        </Typography>
      </Paper>
    </Box>
  );
};

export default Home;
