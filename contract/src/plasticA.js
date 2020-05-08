/* eslint-disable no-use-before-define */
import harden from '@agoric/harden';
import produceIssuer from '@agoric/ertp';
import { makeZoeHelpers } from '@agoric/zoe/src/contractSupport/zoeHelpers';

/**
 * This contract mints a NFT.
 */
export const makeContract = harden(zcf => {
  // Internal token mint for NFT
  const { issuer, mint, amountMath } = produceIssuer('plastics', 'strSet');

  const { inviteAnOffer, rejectOffer } = makeZoeHelpers(zcf);

  // make the zoe helpers
  const zoeHelpers = makeZoeHelpers(zcf);

  let adminOfferHandle;
  const adminHook = offerHandle => {
    adminOfferHandle = offerHandle;
    return `admin invite redeemed`;
  };

  return zcf.addNewIssuer(issuer, 'Plastic').then(() => {
    const offerHook = offerHandle => {
      const paymentTypeA = mint.mintPayment(
        amountMath.make([{ type: 'typeA' }]),
      );

      return zoeHelpers
        .escrowAndAllocateTo({
          amount: 10,
          paymentTypeA,
          keyword: 'Plastic',
          recipientHandle: offerHandle,
        })
        .then(() => {
          zcf.complete(harden([offerHandle]));
          return 'Offer completed. You should receive a payment from Zoe';
        });
    };

    // const makeInvite = () => zcf.makeInvitation(offerHook, 'mint a payment');
    const makeInvite = () =>
      inviteAnOffer(
        harden({
          offerHook,
          customProperties: { inviteDesc: 'Plastic' },
        }),
      );

    return harden({
      // invite: makeInvite(),
      invite: inviteAnOffer(
        harden({
          offerHook: adminHook,
          customProperties: { inviteDesc: 'admin' },
        }),
      ),
      publicAPI: {
        makeInvite,
        getTokenIssuer: () => issuer,
      },
    });
  });
});
