// @ts-check
import dappConstants from '../lib/constants.js';
import { connect } from './connect.js';
import { walletUpdatePurses, flipSelectedBrands } from './wallet.js';
import defaults from '../conf/defaults';

/**
 * @type {Object.<string, HTMLSelectElement>}
 */
const selects = {
  $brands: /** @type {HTMLSelectElement} */ (document.getElementById('brands')),
  $tipPurse: /** @type {HTMLSelectElement} */ (document.getElementById('tipPurse')),
};

const $forFree = /** @type {HTMLInputElement} */ (document.getElementById('forFree'));
const $forTip = /** @type {HTMLInputElement} */ (document.getElementById('forTip'));
const $encourageForm = /** @type {HTMLFormElement} */ (document.getElementById('encourageForm'));

export default async function main () {
  selects.$brands.addEventListener('change', () => {
    flipSelectedBrands(selects);
  });

  /**
   * @param {{ type: string; data: any; walletURL: string }} obj
   */
  const walletRecv = obj => {
    switch (obj.type) {
      case 'walletUpdatePurses': {
        const purses = JSON.parse(obj.data);
        console.log('got purses', purses);
        walletUpdatePurses(purses, selects);
        $inputAmount.removeAttribute('disabled');
        break;
      }
      case 'walletURL': {
        // Change the form action to URL.
        $encourageForm.action = `${obj.walletURL}`;
        break;
      }
    }
  };

  const $numEncouragements = /** @type {HTMLInputElement} */ (document.getElementById('numEncouragements'));
  const $inputAmount = /** @type {HTMLInputElement} */ (document.getElementById('inputAmount'));

  /**
   * @param {{ type: string; data: any; }} obj
   */
  const apiRecv = obj => {
    switch (obj.type) {
      case 'encouragement/getEncouragementResponse':
        alert(`Encourager says: ${obj.data}`);
        break;
      case 'encouragement/encouragedResponse':
        $numEncouragements.innerHTML = obj.data.count;
        break;
    }
  };

  const $encourageMe = /** @type {HTMLInputElement} */ (document.getElementById('encourageMe'));

  const walletSend = await connect('wallet', walletRecv).then(walletSend => {
    walletSend({ type: 'walletGetPurses' });
    return walletSend;
  });

  const apiSend = await connect('api', apiRecv).then(apiSend => {
    apiSend({
      type: 'encouragement/subscribeNotifications',
    });

    $encourageMe.removeAttribute('disabled');
    $encourageMe.addEventListener('click', () => {
      if ($forFree.checked) {
        $encourageForm.target = '';
        apiSend({
          type: 'encouragement/getEncouragement',
        });
      }
      if ($forTip.checked) {
        $encourageForm.target = '_blank';
        const now = Date.now();

        const offer = {
          // JSONable ID for this offer.  This is scoped to the origin.
          id: now,

          // Contract-specific metadata.
          // Uncomment the contract that you want to use
          // instanceRegKey: INSTANCE_REG_KEY,
          // instanceRegKey: defaults.INSTANCE_REG_KEY_FUNGIBLE,
          instanceRegKey: defaults.INSTANCE_REG_KEY_NFT,

          // Format is:
          //   hooks[targetName][hookName] = [hookMethod, ...hookArgs].
          // Then is called within the wallet as:
          //   E(target)[hookMethod](...hookArgs)
          hooks: {
            publicAPI: {
              getInvite: ['makeInvite'], // E(publicAPI).makeInvite()
            },
          },

          proposalTemplate: {
            // That's how we mint fungible dynamic - works
            // want: {
            //   TypeA: {
            //     pursePetname: selects.$tipPurse.value,
            //     extent: Number($inputAmount.value)
            //   },
            // },
            // That's how we mint NFT dynamic - problematic
            want: {
              Plastic: {
                pursePetname: 'plastic purse',
                // Replace id to generate a random id
                extent: [{
                  type: 'TypeA',
                  id: Number($inputAmount.value)
                }],
              },
            },
            exit: { onDemand: null },
          },
        };
        console.log(offer.proposalTemplate);
        walletSend({
          type: 'walletAddOffer',
          data: offer
        });
        alert('Please approve your tip, then close the wallet.')
      }
    });

    return apiSend;
  });
}

main();
