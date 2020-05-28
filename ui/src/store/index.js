import React from 'react'

export const Store = React.createContext()

export const createDefaultState = () => {
  return {
    purses: [],
    assets: [],
    conversions: [],
    decompositions: [],
    success: false,
    creatorPurses: [],
    converterPurses: [],
    decomposerPurses: []
  }
}

export function reducer (state, action) {
  switch (action.type) {
    case 'UPDATEPURSES':
      return { ...state, purses: action.payload }
    case 'UPDATECREATORPURSES':
      return { ...state, creatorPurses: action.payload }
    case 'UPDATECONVERTERPURSES':
      return { ...state, converterPurses: action.payload }
    case 'UPDATEDECOMPOSERPURSES':
      return { ...state, decomposerPurses: action.payload }
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
      return { ...state, success: action.payload }
    case 'EXPLAIN':
      return { ...state }
    default:
      return state
  }
}