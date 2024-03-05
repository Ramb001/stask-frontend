// Implementation of https://core.telegram.org/bots/webapps#initializing-web-apps as react hook

import { useEffect } from "react";

export type MainButtonType = {
  show: () => void;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
  setText: (text: string) => void;
  hide: () => void;
};

export type BackButtonType = {
  show: () => void;
  onClick: (callback: () => void) => void;
  hide: () => void;
};

export type WebApp = {
  sendData: (data: string) => void;
  showAlert: (message: string) => void;
  MainButton: MainButtonType;
  BackButton: BackButtonType;
};

export const useWebApp = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.Telegram.WebApp.ready();
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return window.Telegram.WebApp as WebApp;
};
