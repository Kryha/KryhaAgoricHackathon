export const updatePurses = (purses, dispatch) => {
  return dispatch({
    type: 'UPDATEPURSES',
    payload: purses
  })
}

export const retrieveAssets = (dispatch) => {
  return dispatch({
    type: 'RETRIEVEASSETS',
    payload: [{type:'asset 1', description: 'this is asset of type 1'}, {type: 'asset 2',description: 'this is asset of type 2'}]
  })
}

export const mintAssets = (type, purse, amount, dispatch) => {
  console.log('Action:mint', type, purse, amount)
  return dispatch({
    type: 'MINTASSETS',
    payload: true
  })
}

export const createPurchaseOrder = (type, purse, amount, dispatch) => {
  console.log('Action:mint', type, purse, amount)
  // TODO: Mint a new paid_invoice NFT
  // TODO: Exchange paid_invoice NFT for amount of type tokens
  return dispatch({
    type: 'CREATEPURCHASEORDER',
    payload: true
  })
}

export const retrieveConversions = (dispatch) => {

  return dispatch({
    type: 'RETRIEVECONVERSIONS',
    payload: [{input:[{type:'asset 1', amount:10}, {type:'asset 2', amount: 5}], output:'type b'}]
  }) 
}

export const convert = (input, output, amount, dispatch) => {
  // input is gonna be a list of objects i think that i will destructure

  return dispatch({
    type: 'CONVERT',
    payload: true
  })
}

export const retrieveDecompositions = (dispatch) => {

  return dispatch({
    type: 'RETRIEVEDECOMPOSITIONS',
    payload: [{output:[{type:'asset 1', amount:10}, {type:'asset 2', amount: 5}], input:'type b'}]
  })  
}

export const decompose = (input, amount, dispatch) => {
  // find right decomposition that matches input

  return dispatch({
    type: 'DECOMPOSE',
    payload: true
  })
}