import React from 'react'

export const Store = React.createContext()

const initialState = {
  assets: [],
  conversions: [],
  decompositions: []
}

function reducer (state, action) {
  switch (action.type) {
    case 'RETRIEVEASSETS':
      return { ...state, assets: action.payload }
    case 'MINTASSETS':
      return { ...state, success: action.payload }
    case 'CREATEPURCHASEORDER':
      return { ...state, success: action.payload }
    case 'RETRIEVECONVERSIONS':
      return { ...state, conversions: action.payload }
    case 'CONVERT':
      return { ...state, conversions: action.payload }
    case 'RETRIEVEDECOMPOSITIONS':
      return { ...state, decompositions: action.payload }
    case 'DECOMPOSE':
      return { ...state, conversions: action.payload }    
    default:
      return state
  }
}

export function StoreProvider (props) {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const value = { state, dispatch }
  return <Store.Provider value={value}>{props.children}</Store.Provider>
}
