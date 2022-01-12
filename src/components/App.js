import React, { useState, useEffect } from "react";
import { dbService, storageService, authService } from "fbase";
import AppRouter from "components/Router";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [init, setInit] = useState(false);
  const [admin, setAdmin] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [uid, setUid] = useState("");

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
        setUid(user.uid);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  useEffect(() => {
    if (admin.includes(uid)) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [uid, admin]);

  return (
    <>
      {init ? (
        <AppRouter isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
      ) : (
        "Loading..."
      )}
    </>
  );
}

export default App;
