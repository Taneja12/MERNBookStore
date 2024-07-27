//NOT IN USE

import React, { createContext, useState, useContext } from 'react';

// Create the Alert Context
const AlertContext = createContext();

// Create the Alert Provider component
export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState('');

  return (
    <AlertContext.Provider value={{ alert, setAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

// Custom hook for using the Alert Context
export const useAlert = () => useContext(AlertContext);
