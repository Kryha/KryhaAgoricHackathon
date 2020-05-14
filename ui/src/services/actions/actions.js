import { doFetch } from '../utils/fetch-websocket';
import defaults from '../../conf/defaults';
import { v1 as uuidv1 } from 'uuid';

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
  console.log('Action:mint', type, purse, amount)
  const purses = ['typeA purse', 'typeB purse', 'typeC purse']
  if (!purses.includes(purse)) {
    return alert('The Creator can only mint fungible tokens')
  }
  let instanceRegKey
  switch (purse) {
    case 'typeA purse':
      instanceRegKey = defaults.INSTANCE_REG_KEY_FUNGIBLE_A
      break;
    case 'typeB purse':
      instanceRegKey = defaults.INSTANCE_REG_KEY_FUNGIBLE_B
      break;
    case 'typeC purse':
      instanceRegKey = defaults.INSTANCE_REG_KEY_FUNGIBLE_C
      break
    default:
      break
  }

  const offer = {
    id: Date.now(),
    instanceRegKey: instanceRegKey,
    contractIssuerIndexToKeyword: ['TypeA', 'TypeB', 'TypeC'],
    hooks: {
      publicAPI: {
        getInvite: ['makeInvite']
      },
    },
    proposalTemplate: {
      want: {
        'Type*': {
          pursePetname: purse,
          extent: Number(amount)
        }
      },
      exit: { onDemand: null }
    }
  };
  console.log(offer.proposalTemplate);
  doFetch(
    {
      type: 'walletAddOffer',
      data: offer,
    },
  )
  return dispatch({
    type: 'MINTASSETS',
    payload: true
  })
}

export const createPurchaseOrder = (type, purse, amount, dispatch) => {
  console.log('Action:mint', type, purse, amount)
  // TODO: Mint a new paid_invoice NFT
  // TODO: Exchange paid_invoice NFT for amount of type tokens
  const offer = {
    id: Date.now(),
    instanceRegKey: defaults.INSTANCE_REG_KEY_INVOICE,
    hooks: {
      publicAPI: {
        getInvite: ['makeInvite']
      }
    },
    proposalTemplate: {
      want: {
        Invoice: {
          pursePetname: 'invoice purse',
          extent: [{
            type: type,
            invoiceId: uuidv1()
          }]
        }
      },
      exit: { onDemand: null }
    }
  }
  console.log(offer.proposalTemplate);
  doFetch(
    {
      type: 'walletAddOffer',
      data: offer,
    },
  )
  return dispatch({
    type: 'CREATEPURCHASEORDER',
    payload: true
  })
}

export const retrieveConversions = (dispatch) => {

  return dispatch({
    type: 'RETRIEVECONVERSIONS',
    payload: [{ input: [{ type: 'asset 1', amount: 10 }, { type: 'asset 2', amount: 5 }], output: 'type b' }]
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