/* eslint-disable no-use-before-define */
import harden from '@agoric/harden';
import produceIssuer from '@agoric/ertp';
import { makeZoeHelpers } from '@agoric/zoe/src/contractSupport/zoeHelpers';

/**
 * This contract mints a NFT.
 */
export const makeContract = harden(zcf => {
  // Internal token mint for NFT
  const { issuer, mint, amountMath } = produceIssuer('plastic', 'set');

  // make the zoe helpers
  const zoeHelpers = makeZoeHelpers(zcf);

  return zcf.addNewIssuer(issuer, 'Plastic').then(() => {
    const offerHook = offerHandle => {
      const typeAnft = amountMath.make(harden([{ type: 'typeA' }]));
      const paymentNftTypeA = mint.mintPayment(typeAnft);

      return zoeHelpers
        .escrowAndAllocateTo({
          amount: typeAnft,
          payment: paymentNftTypeA,
          keyword: 'Plastic',
          recipientHandle: offerHandle,
        })
        .then(() => {
          zcf.complete(harden([offerHandle]));
          return 'Offer completed. You should receive a payment from Zoe';
        });
    };

    // const makeInvite = () => zcf.makeInvitation(offerHook, 'mint a payment');
    const makeInvite = () => zcf.makeInvitation(offerHook, 'Plastic');

    return harden({
      invite: makeInvite(),
      publicAPI: {
        makeInvite,
        getTokenIssuer: () => issuer,
      },
    });
  });
});
