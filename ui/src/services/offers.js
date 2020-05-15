import { doFetch } from './utils/fetch-websocket';
import defaults from '../conf/defaults';
import { v1 as uuidv1 } from 'uuid';

export const mintAssetsOffer = (type, purse, amount) => {
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
      return alert('The Creator can only mint raw material tokens')
  }

  const offer = {
    id: Date.now(),
    instanceRegKey,
    contractIssuerIndexToKeyword: ['Type*'],
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

  return offer;
}

export const mintNFTOffer = (type, purse, amount) => {
  console.log('Action:mint', type, purse, amount)
  
  // TODO: Make this dynamic based on the purse/type
  const instanceRegKey = defaults.INSTANCE_REG_KEY_INVOICE

  const offer = {
    id: Date.now(),
    instanceRegKey,
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
            id: uuidv1().substring(0,8),
            amount,
          }]
        }
      },
      exit: { onDemand: null }
    }
  }
  return offer;
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