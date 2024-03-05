import { createContext } from "react";
import { WebApp } from "../hooks/useWebApp";

export type WebAppContextType = {
  WebApp?: WebApp;
};

export const WebAppContext = createContext<WebAppContextType>({});
