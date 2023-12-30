import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Home from "routes/Home";
import Auth from "routes/Auth";
import Cashbook from "routes/Cashbook";
import Calculator from "routes/Calculator";
import CommonAccount from "routes/CommonAccount";
import Statistics from "routes/Statistics";
import Navigation from "components/Navigation";
import AddPlaces from "routes/AddPlaces";
import Profile from "routes/Profile";

const AppRouter = ({ isLoggedIn, isAdmin }) => {
  window.localStorage.setItem("isAdmin", JSON.stringify(isAdmin));

  return (
    <Router>
      <Navigation isLoggedIn={isLoggedIn} />
      <Switch>
        {isLoggedIn ? (
          <>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/cashbook">
              <Cashbook />
            </Route>
            <Route exact path="/calculator">
              <Calculator />
            </Route>
            <Route exact path="/common">
              <CommonAccount />
            </Route>
            <Route exact path="/statistics">
              <Statistics />
            </Route>
            <Route exact path="/addplaces">
              <AddPlaces />
            </Route>
            <Route exact path="/profile">
              <Profile />
            </Route>
          </>
        ) : (
          <>
            <Route path="/">
              <Auth />
            </Route>
          </>
        )}
      </Switch>
    </Router>
  );
};

export default AppRouter;
