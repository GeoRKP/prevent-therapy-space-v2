"use client";

import React, { createContext, useContext } from "react";

const dataContext = createContext({});

export const useContextElement = () => useContext(dataContext);

export default function Context({ children }) {
  return <dataContext.Provider value={{}}>{children}</dataContext.Provider>;
}
