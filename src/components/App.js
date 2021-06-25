import React, {useEffect, useState} from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fbase';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [init, setInit] = useState(false);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if(user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    })
  }, []);

  return (
    <>
    {init ? <AppRouter isLoggedIn = {isLoggedIn} /> : "Loading..."}
    </>    
  );
}

export default App;
