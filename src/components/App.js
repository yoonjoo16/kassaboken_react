import React, { useState, useEffect } from "react";
import { dbService, storageService, authService } from "fbase";
import AppRouter from "components/Router";
import userEvent from "@testing-library/user-event";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [init, setInit] = useState(false);
  const [admin, setAdmin] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newUser, setNewUser] = useState("");

  const getAdmin = async () => {
    const dbRecords = await dbService.collection("admin").get();
    dbRecords.forEach((item) => {
      const obj = {
        ...item.data(),
        id: item.id,
      };

      setAdmin((prev) => [obj.key, ...prev]);
    });
  };

  useEffect(() => {
    getAdmin();
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setNewUser(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  useEffect(() => {
    if (admin.includes(newUser.uid)) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [newUser]);

  return (
    <>
      {init ? (
        <AppRouter isLoggedIn={isLoggedIn} isAdmin={isAdmin} user={newUser} />
      ) : (
        "Loading..."
      )}
    </>
  );
}

export default App;
