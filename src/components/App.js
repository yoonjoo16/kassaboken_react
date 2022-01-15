import React, { useState, useEffect } from "react";
import { dbService, authService } from "fbase";
import AppRouter from "components/Router";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [init, setInit] = useState(false);
  const [admin, setAdmin] = useState([]);
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
    authService.onAuthStateChanged((user) => {
      if (user) {
        getAdmin().then(() => {
          setNewUser(user);
          setIsLoggedIn(true);
        });
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? (
        <AppRouter
          isLoggedIn={isLoggedIn}
          isAdmin={admin.includes(newUser.uid)}
        />
      ) : (
        "Loading..."
      )}
    </>
  );
}

export default App;
