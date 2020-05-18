import React, { createContext, useContext, useReducer, useEffect } from 'react';

import {
  activateWebSocket,
  deactivateWebSocket,
  doFetch,
} from './../services/utils/fetch-websocket';
import {
  updatePurses,
} from '../services/actions';
import { reducer, createDefaultState } from '.';

export const ApplicationContext = createContext();

export function useApplicationContext() {
  return useContext(ApplicationContext);
}

/* eslint-disable complexity, react/prop-types */
export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, createDefaultState());

  useEffect(() => {
    function messageHandler(message) {
      if (!message) return;
      const { type, data } = message;
      if (type === 'walletUpdatePurses') {
        updatePurses(JSON.parse(data), dispatch)
      }
    }

    function walletGetPurses() {
      return doFetch({ type: 'walletGetPurses' }).then(messageHandler);
    }

    activateWebSocket({
      onConnect() {
        walletGetPurses();
      },
      onDisconnect() {
      },
      onMessage(data) {
        messageHandler(JSON.parse(data));
      },
    });

    return deactivateWebSocket;
  }, []);

  return (
    <ApplicationContext.Provider value={{ state, dispatch }}>
      {children}
    </ApplicationContext.Provider>
  );
}