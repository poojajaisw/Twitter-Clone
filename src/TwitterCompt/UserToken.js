import React, { createContext, useContext, useState } from 'react';


const UserContext = createContext();


export const UserProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);

  const loginUser = (token) => {
    setUserToken(token);
  };

  const logoutUser = () => {
    setUserToken(null);
  };

  return (
    <UserContext.Provider value={{ userToken, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
