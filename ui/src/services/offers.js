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

export const mintNFTOffer = (type, purse, invoicePurse, amount) => {
  console.log('Action:mint', type, purse, invoicePurse, amount)

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
          pursePetname: invoicePurse,
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

export const convertOffer = (input, output, amount) => {
  console.log('Action:convert', input, output, amount);

  const instanceRegKey = defaults.INSTANCE_REG_KEY_CONVERTER;

  const prices = input.map(i => {
    return {
      pursePetname: i.purse,
      extent: Number(i.amount * amount)
    }
  })

  const assets = output.map(o => {
    return {
      pursePetname: o.purse,
      extent: [{
        type: o.type,
        id: uuidv1().substring(0, 8),
        amount: Number(o.amount * amount)
      }]
    }
  })

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
        'Plastic': assets[0]
      },
      give: {
        'Price': prices[0]
      },
      exit: { onDemand: null }
    }
  }
  return offer;
}

export const decompose = (input, amount, dispatch) => {
  // find right decomposition that matches input

  return dispatch({
    type: 'DECOMPOSE',
    payload: true
  })
}