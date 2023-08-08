import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  localStorage.setItem('token', null)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);


  const logIn = (userDetails) => {
    setIsLoggedIn(true);
    setUser(userDetails);
    localStorage.setItem('token', userDetails.token);
  }

  const logOut = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('token');
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, logIn, logOut, user }}>
      {props.children}
    </AuthContext.Provider>
  );
};

