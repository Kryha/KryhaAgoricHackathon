/* eslint-disable no-use-before-define */
import harden from '@agoric/harden';
import produceIssuer from '@agoric/ertp';
import { makeZoeHelpers } from '@agoric/zoe/src/contractSupport/zoeHelpers';

export const makeContract = harden(zcf => {
  const { issuer, mint, amountMath } = produceIssuer('typeA');

  const { inviteAnOffer } = makeZoeHelpers(zcf);

  const zoeHelpers = makeZoeHelpers(zcf);

  return zcf.addNewIssuer(issuer, 'TypeC').then(() => {
    const mintHook = offerHandle => {
      const requestOffer = zcf.getOffer(offerHandle);
      const tokenRequestExtent = requestOffer.proposal.want.TypeA.extent;

      const amount = amountMath.make(tokenRequestExtent);
      const payment = mint.mintPayment(amount);

      return zoeHelpers
        .escrowAndAllocateTo({
          amount,
          payment,
          keyword: 'TypeC',
          recipientHandle: offerHandle,
        })
        .then(() => {
          zcf.complete(harden([offerHandle]));
          return 'Offer completed. You should receive a payment from Zoe';
        });
    };

    const makeInvite = () =>
      inviteAnOffer(
        harden({
          offerHook: mintHook,
          customProperties: { inviteDesc: 'mint' },
        }),
      );

    return harden({
      invite: inviteAnOffer(
        harden({
          offerHook: mintHook,
          customProperties: { inviteDesc: 'mint' },
        }),
      ),
      publicAPI: {
        makeInvite,
        getTokenIssuer: () => issuer,
      },
    });
  });
});