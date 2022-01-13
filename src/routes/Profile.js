import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { authService, firebaseInstance } from "fbase";
import Button from "@mui/material/Button";

const Profile = ({ isAdmin }) => {
  var user = authService.currentUser;

  const onDeleteClick = async (event) => {
    const ok = window.confirm("Are you sure?");
    if (ok) {
      user
        .delete()
        .then(() => {
          window.alert("The account has been removed from Kassaboken.");
        })
        .catch((err) => {
          window.alert("Error! Contact Yoonjoo.");
        });
    }
  };

  return (
    <Box sx={{ m: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Avatar
          alt={user.displayName}
          src={user.photoURL}
          sx={{ width: 56, height: 56 }}
        />
        <Typography variant="h5" gutterBottom>
          {isAdmin
            ? `${user.displayName} (Admin)`
            : `${user.displayName} (Guest)`}
        </Typography>
        <p />
        <Button variant="outlined" onClick={onDeleteClick}>
          <Typography variant="button" component="div">
            Remove this account from Kassaboken
          </Typography>
        </Button>
      </Paper>
    </Box>
  );
};

export default React.memo(Profile);
