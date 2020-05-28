import React, { createContext, useContext, useReducer, useEffect } from 'react';

import {
  activateWebSocket,
  deactivateWebSocket,
  doFetch,
} from './../services/utils/fetch-websocket';
import {
  updatePurses,
  updateCreatorPurses,
  updateConverterPurses,
  updateDecomposerPurses
} from '../services/actions';
import { reducer, createDefaultState } from '.';

export const ApplicationContext = createContext();

export function useApplicationContext () {
  return useContext(ApplicationContext);
}

/* eslint-disable complexity, react/prop-types */
export default function Provider (props) {
  const [state, dispatch] = useReducer(reducer, createDefaultState());
  const children = props.children
  const user = props.user

  useEffect(() => {
    function messageHandler (message) {
      if (!message) return;
      const { type, data } = message;
      // if (type === 'walletUpdatePurses') {
      //   updatePurses(JSON.parse(data), dispatch)
      // }
      if (type === 'walletUpdatePurses') {
        switch (user) {
          case 'creator':
            return updateCreatorPurses(JSON.parse(data), dispatch)
          case 'converter':
            return updateConverterPurses(JSON.parse(data), dispatch)
          case 'decomposer':
            return updateDecomposerPurses(JSON.parse(data), dispatch)
          default:
            return updatePurses(JSON.parse(data), dispatch)
        }
      }
    }

    function walletGetPurses () {
      return doFetch({ type: 'walletGetPurses' }).then(messageHandler);
    }

    activateWebSocket({
      onConnect () {
        walletGetPurses();
      },
      onDisconnect () {
      },
      onMessage (data) {
        messageHandler(JSON.parse(data));
      },
    }, user);

    return deactivateWebSocket;
  }, [props.user]);

  return (
    <ApplicationContext.Provider value={{ state, dispatch }}>
      {children}
    </ApplicationContext.Provider>
  );
}