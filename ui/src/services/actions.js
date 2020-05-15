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
  const offer = mintAssetsOffer(type, purse, amount);
  walletAddOffer(offer)

  return dispatch({
    type: 'MINTASSETS',
    payload: true
  })
}

export const createPurchaseOrder = async (type, purse, amount, dispatch) => {
  const mintOffer = mintNFTOffer(type, purse, amount);
  const temp = await walletAddOffer(mintOffer);
  console.log('temp:', temp);

  console.log('mintOFFER:', mintOffer.proposalTemplate.want)

  const want = mintOffer.proposalTemplate.want;

  const mintOffer2 = exchangeOffer(type, purse, amount, want);
  console.log('MINTOFFER222222', mintOffer2);
  const temp2 = await walletAddOffer(mintOffer2);
  console.log('temp:', temp2);

  // TODO: exchange for raw materials immediately after
  // const mintOffer2 = mintNFTOffer(type, purse, amount);
  // const temp2 = await walletAddOffer(mintOffer2)

  return dispatch({
    type: 'CREATEPURCHASEORDER',
    payload: true
  })
}

export const retrieveConversions = (dispatch) => {

  return dispatch({
    type: 'RETRIEVECONVERSIONS',
    payload: [{ input: [{ type: 'typeA', amount: 10 }, { type: 'typeB', amount: 5 }], output: 'Plastic' }]
  })
}

export const convert = (type, purse, amount, dispatch) => {
  // input is gonna be a list of objects i think that i will destructure
  const offer = convertOffer(type, purse, amount);
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
