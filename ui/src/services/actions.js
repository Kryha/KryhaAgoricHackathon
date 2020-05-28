import defaultsCreator from '../conf/defaultsCreator';
import defaultsConverter from '../conf/defaultsConverter';
import dappConstants from '../constants'

import { walletAddOffer } from './utils/wallet';
import { mintAssetsOffer, mintNFTOffer, exchangeOffer, convertOffer, decomposeOffer } from './offers';

export const updateCreatorPurses = (creatorPurses, dispatch) => {
  return dispatch({
    type: 'UPDATECREATORPURSES',
    payload: creatorPurses
  })
}

export const updateConverterPurses = (converterPurses, dispatch) => {
  return dispatch({
    type: 'UPDATECONVERTERPURSES',
    payload: converterPurses
  })
}

export const updateDecomposerPurses = (decomposerPurses, dispatch) => {
  return dispatch({
    type: 'UPDATEDECOMPOSERPURSES',
    payload: decomposerPurses
  })
}

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
      instanceRegKey = defaultsCreator.INSTANCE_REG_KEY_FUNGIBLE_A
      break;
    case 'TypeB purse':
      instanceRegKey = defaultsCreator.INSTANCE_REG_KEY_FUNGIBLE_B
      break;
    case 'TypeC purse':
      instanceRegKey = defaultsCreator.INSTANCE_REG_KEY_FUNGIBLE_C
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
  // if (!(purse === 'TypeA purse' || purse === 'TypeB purse' || purse === 'TypeC purse')) {
  //   return alert('The Converter can only create an invoice for raw material tokens')
  // }
  const instanceRegKey = defaultsConverter.INSTANCE_REG_KEY_INVOICE
  const mintOffer = mintNFTOffer(type, purse, invoicePurse, instanceRegKey, amount);
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
  walletAddOffer(offer);

  return dispatch({
    type: 'CONVERT',
    payload: true
  })
}

export const retrieveDecompositions = (dispatch) => {
  return dispatch({
    type: 'RETRIEVEDECOMPOSITIONS',
    payload: [{ input: [{ type: 'plastic bottle', purse: 'plastic bottle purse', amount: 1 }], output: [{ type: 'typeA2', purse: 'Recycled typeA2 purse', amount: 4 }] }]
  });
}

export const decompose = (input, output, amount, dispatch) => {
  const offer = decomposeOffer(input, output, amount);
  walletAddOffer(offer);

  return dispatch({
    type: 'DECOMPOSE',
    payload: true
  })
}

export const explain = (dispatch) => {
  alert("Creating a purchase order with multiple wallets would invoke an exchange. In this simple demo with one wallet it only mints the invoice requested.")
  return dispatch({
    type: 'EXPLAIN',
  })
}