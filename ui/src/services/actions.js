import { doFetch } from './utils/fetch-websocket';
import defaults from '../conf/defaults';
import { v1 as uuidv1 } from 'uuid';

import { walletAddOffer } from './utils/wallet';
import { mintAssetsOffer, mintNFTOffer, exchangeOffer, convertOffer } from './offers';

export const updatePurses = (purses, dispatch) => {
  return dispatch({
    type: 'UPDATEPURSES',
    payload: purses
  })
}

export const retrieveAssets = (dispatch) => {
  return dispatch({
    type: 'RETRIEVEASSETS',
    payload: [{ type: 'asset 1', description: 'this is asset of type 1' }, { type: 'asset 2', description: 'this is asset of type 2' }]
  })
}

export const mintAssets = (type, purse, amount, dispatch) => {
  let instanceRegKey
  switch (purse) {
    case 'TypeA purse':
      instanceRegKey = defaults.INSTANCE_REG_KEY_FUNGIBLE_A
      break;
    case 'TypeB purse':
      instanceRegKey = defaults.INSTANCE_REG_KEY_FUNGIBLE_B
      break;
    case 'TypeC purse':
      instanceRegKey = defaults.INSTANCE_REG_KEY_FUNGIBLE_C
      break
    default:
      return alert('The Creator can only mint raw material tokens')
  }
  const offer = mintAssetsOffer(type, purse, amount, instanceRegKey);
  walletAddOffer(offer)

  return dispatch({
    type: 'MINTASSETS',
    payload: true
  })
}

export const createPurchaseOrder = async (type, purse, amount, invoicePurse, dispatch) => {
  if (!(purse === 'TypeA purse' || purse === 'TypeB purse' || purse === 'TypeC purse')) {
    return alert('The Converter can only create an invoice for raw material tokens')
  }
  const mintOffer = mintNFTOffer(type, purse, invoicePurse, amount);
  await walletAddOffer(mintOffer);

  return dispatch({
    type: 'CREATEPURCHASEORDER',
    payload: true
  })
}

export const createPurchaseOrderDec = async (type, purse, amount, invoicePurse, dispatch) => {
  if (!(purse === 'plastic bottle purse')) {
    return alert('The Decomposer can only create an invoice for plastic tokens')
  }
  const mintOffer = mintNFTOffer(type, purse, invoicePurse, amount);
  await walletAddOffer(mintOffer);

  return dispatch({
    type: 'CREATEPURCHASEORDERDEC',
    payload: true
  })
}

export const retrieveConversions = (dispatch) => {
  return dispatch({
    type: 'RETRIEVECONVERSIONS',
    payload: [{ input: [{ type: 'typeA', purse: 'TypeA purse', amount: 5 }], output: [{ type: 'plastic bottle', purse: 'plastic bottle purse', amount: 1 }] }]
  })
}

export const convert = (input, output, amount, dispatch) => {
  // input is gonna be a list of objects i think that i will destructure
  const offer = convertOffer(input, output, amount);
  console.log('offer', offer)
  walletAddOffer(offer);

  return dispatch({
    type: 'CONVERT',
    payload: true
  })
}

export const retrieveDecompositions = (dispatch) => {

  return dispatch({
    type: 'RETRIEVEDECOMPOSITIONS',
    payload: [{ output: [{ type: 'asset 1', amount: 10 }, { type: 'asset 2', amount: 5 }], input: 'type b' }]
  })
}

export const decompose = (input, amount, dispatch) => {
  // find right decomposition that matches input

  return dispatch({
    type: 'DECOMPOSE',
    payload: true
  })
}