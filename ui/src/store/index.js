import React from 'react'

export const Store = React.createContext()

export const createDefaultState = () => {
  return {
    purses: [],
    assets: [],
    conversions: [],
    decompositions: [],
    success: false,
  }
}

export function reducer (state, action) {
  switch (action.type) {
    case 'UPDATEPURSES':
      return { ...state, purses: action.payload }
    case 'RETRIEVEASSETS':
      return { ...state, assets: action.payload }
    case 'MINTASSETS':
      return { ...state, success: action.payload }
    case 'CREATEPURCHASEORDER':
      return { ...state, success: action.payload }
    case 'CREATEPURCHASEORDERDEC':
      return { ...state, success: action.payload }
    case 'RETRIEVECONVERSIONS':
      return { ...state, conversions: action.payload }
    case 'CONVERT':
      return { ...state, success: action.payload }
    case 'RETRIEVEDECOMPOSITIONS':
      return { ...state, decompositions: action.payload }
    case 'DECOMPOSE':
      return { ...state, conversions: action.payload }
    case 'EXPLAIN':
      return { ...state }
    default:
      return state
  }
}

// export function StoreProvider ({children}) {
//   const [state, dispatch] = React.useReducer(reducer, initialState)
//   const value = { state, dispatch }
//   return <Store.Provider value={value}>{children}</Store.Provider>
// }
