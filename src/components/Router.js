import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Home from "routes/Home";
import Auth from "routes/Auth";
import Cashbook from "routes/Cashbook";
import Calculator from "routes/Calculator";
import Statistics from "routes/Statistics";
import Navigation from "components/Navigation";
import AddPlaces from "routes/AddPlaces";

const AppRouter = ({ isLoggedIn, isAdmin }) => {
  return (
    <Router>
      {isLoggedIn && <Navigation />}
      <Switch>
        {isLoggedIn ? (
          <>
            <Route exact path="/">
              <Home isAdmin={isAdmin} />
            </Route>
            <Route exact path="/cashbook">
              <Cashbook isAdmin={isAdmin} />
            </Route>
            <Route exact path="/calculator">
              <Calculator isAdmin={isAdmin} />
            </Route>
            <Route exact path="/statistics">
              <Statistics isAdmin={isAdmin} />
            </Route>
            <Route exact path="/addplaces">
              <AddPlaces isAdmin={isAdmin} />
            </Route>
          </>
        ) : (
          <>
            <Route exact path="/">
              <Auth />
            </Route>
          </>
        )}
      </Switch>
    </Router>
  );
};

export default AppRouter;
