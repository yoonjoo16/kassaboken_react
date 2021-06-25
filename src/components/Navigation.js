import React from "react";
import { Link, useHistory } from "react-router-dom";
import { authService } from "fbase";

const Navigation = () => {
  let history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/cashbook">Cashbook</Link>
        </li>
        <li>
          <Link to="/statistics">Statistics</Link>
        </li>
        <button onClick={onLogOutClick}>Log out</button>
      </ul>
    </nav>
  );
};

export default Navigation;
