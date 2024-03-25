// TokenContext.js
import React, { createContext, useContext, useState } from 'react';

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [tokenValue, setTokenValue] = useState(null);

  const setToken = (value) => {
    setTokenValue(value);
  };

  return (
    <TokenContext.Provider value={{ tokenValue, setToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
};
