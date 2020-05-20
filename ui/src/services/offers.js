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

export const mintNFTOffer = (type, purse, invoicePurse, instanceRegKey, amount) => {
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
  const instanceRegKey = defaults.INSTANCE_REG_KEY_CONVERTER;

  const prices = input.map(i => {
    return {
      pursePetname: i.purse,
      extent: Number(i.amount * amount)
    }
  })

  const assets = output.map(o => {
    const outputAmount = o.amount * amount
    const assets = Array.from(Array(outputAmount)).map(() => {
      return {
        type: o.type,
        id: uuidv1().substring(0, 8),
      }
    });

    return {
      pursePetname: o.purse,
      extent: assets
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
        'Asset': assets[0]
      },
      give: {
        'Price': prices[0]
      },
      exit: { onDemand: null }
    }
  }
  return offer;
}

export const decomposeOffer = (input, output, amount) => {
  const instanceRegKey = defaults.INSTANCE_REG_KEY_DECOMPOSER;

  const tokens = output.map(o => {
    return {
      pursePetname: o.purse,
      extent: Number(o.amount * amount)
    }
  })

  const offer = {
    id: Date.now(),
    instanceRegKey,
    contractIssuerIndexToKeyword: ['Type*'],
    hooks: {
      publicAPI: {
        getInvite: ['makeInvite']
      }
    },
    proposalTemplate: {
      want: {
        'Type*': tokens[0]
      },
      give: {
        'Asset': {
          pursePetname: input[0].purse,
          extent: input[0].extent
        },
      },
      exit: { onDemand: null }
    }
  }
  return offer;
}