import { authService, firebaseInstance } from "fbase";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
/>;

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await authService.signInWithEmailAndPassword(email, password);
    } catch (e) {
      setError(e.message);
    }
  };

  const onSocialClick = async (event) => {
    await authService.signInWithPopup(
      new firebaseInstance.auth.GoogleAuthProvider()
    );
  };

  return (
    <Container maxWidth="sm">
      <div>
        <Typography variant="h3" component="div">
          Welcome!
        </Typography>

        <Typography variant="body1" component="div">
          You need to sign in to use Kassaboken.
        </Typography>
      </div>
      <div>
        <Box component="form" onSubmit={onSubmit}>
          <TextField
            margin="normal"
            name="email"
            type="text"
            placeholder="Email"
            required
            value={email}
            onChange={onChange}
          />
          <TextField
            margin="normal"
            name="password"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={onChange}
          />
          <TextField margin="normal" type="submit" value="Sign in" />
        </Box>
      </div>
      <div>
        <Button name="google" onClick={onSocialClick}>
          Log in with Google account
        </Button>
        <br />
        <Button name="create">Create new account</Button>
        <br />
        <p>{error}</p>
      </div>
    </Container>
  );
};

export default Auth;
