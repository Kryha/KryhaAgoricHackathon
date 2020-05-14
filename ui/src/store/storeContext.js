import React, { createContext, useContext, useReducer, useEffect } from 'react';

import {
  activateWebSocket,
  deactivateWebSocket,
  doFetch,
} from './../services/utils/fetch-websocket';
import {
  updatePurses,
} from './../services/actions/actions';
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
      console.log('data:', data)
      if (type === 'walletUpdatePurses') {
        dispatch(updatePurses(JSON.parse(data)));
      }
    }

    function walletGetPurses() {
      return doFetch({ type: 'walletGetPurses' }).then(messageHandler);
    }

    console.log('test')

    activateWebSocket({
      onConnect() {
        console.log('onconnect')
        walletGetPurses();
      },
      onDisconnect() {
        console.log('disconnect')
      },
      onMessage(data) {
        console.log(JSON.parse(data))
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