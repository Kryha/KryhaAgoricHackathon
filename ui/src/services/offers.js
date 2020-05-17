import { doFetch } from './utils/fetch-websocket';
import defaults from '../conf/defaults';
import { v1 as uuidv1 } from 'uuid';

export const mintAssetsOffer = (type, purse, amount, instanceRegKey) => {
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
            id: uuidv1().substring(0, 8),
            amount,
          }]
        }
      },
      exit: { onDemand: null }
    }
  }
  return offer;
}

export const exchangeOffer = (type, purse, amount, want) => {
  console.log('Action:mint', type, purse, amount)

  // TODO: Make this dynamic based on the purse/type
  const instanceRegKey = defaults.INSTANCE_REG_KEY_SWAP

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
        'Price': {
          pursePetname: purse,
          extent: Number(amount)
        }
      },
      give: {
        'Asset': {
          pursePetname: 'invoice purse',
          extent: want.Invoice.extent
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

export const convertOffer = (type, purse, amount) => {
  console.log('Action:mint', type, purse, amount);

  const instanceRegKey = defaults.INSTANCE_REG_KEY_CONVERTER;

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
        'Plastic': {
          pursePetname: 'plastic bottle purse',
          extent: [{
            type: 'Plastic',
            id: uuidv1().substring(0, 8)
          }]
        }
      },
      give: {
        'Price': {
          pursePetname: purse,
          extent: Number(amount)
        }
      },
      exit: { onDemand: null }
    }
  }
  return offer;
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