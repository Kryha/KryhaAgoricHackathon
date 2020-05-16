/* eslint-disable no-use-before-define */
import harden from '@agoric/harden';
import produceIssuer from '@agoric/ertp';
import { makeZoeHelpers } from '@agoric/zoe/src/contractSupport/zoeHelpers';

export const makeContract = harden(zcf => {
  // const {
  //   terms: { issuerName },
  // } = zcf.getInstanceRecord();
  const issuerName = 'TypeA';

  const { issuer, mint, amountMath } = produceIssuer('typeA');

  const { checkHook } = makeZoeHelpers(zcf);

  const zoeHelpers = makeZoeHelpers(zcf);

  return zcf.addNewIssuer(issuer, issuerName).then(() => {
    const mintHook = offerHandle => {
      const requestOffer = zcf.getOffer(offerHandle);
      const tokenRequestExtent = requestOffer.proposal.want.TypeA.extent;

      const amount = amountMath.make(tokenRequestExtent);
      const payment = mint.mintPayment(amount);

      return zoeHelpers
        .escrowAndAllocateTo({
          amount,
          payment,
          keyword: issuerName,
          recipientHandle: offerHandle,
        })
        .then(() => {
          zcf.complete(harden([offerHandle]));
          return 'Offer completed. You should receive a payment from Zoe';
        });
    };

    const expectedOffer = harden({
      want: { TypeA: null },
    });

    const makeInvite = () => {
      return zcf.makeInvitation(checkHook(mintHook, expectedOffer), 'mint');
    };

    return harden({
      invite: makeInvite(),
      publicAPI: {
        makeInvite,
        getTokenIssuer: () => issuer,
      },
    });
  });
});