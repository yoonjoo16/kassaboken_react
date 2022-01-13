import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const Home = ({ isAdmin }) => {
  return isAdmin ? (
    <Box sx={{ m: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h3" gutterBottom component="div">
          Hello!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Welcome to Kassaboken! <p />
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
          Hello!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Welcome to Kassaboken! <p />
          This is a cashbook program for Yoonjoo and Erik. If you are the 'Erik'
          but seeing this page, please contact your wife so that she can fix
          your login problem.
          <p /> If you are a guest, feel free to test this cashbook! You can
          change/add/delete anything.
          <p /> If you find some errors or have suggestion, please tell Yoonjoo.
          <p /> Enjoy!
        </Typography>
      </Paper>
    </Box>
  );
};

export default Home;
