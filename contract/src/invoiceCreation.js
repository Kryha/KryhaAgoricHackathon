/* eslint-disable no-use-before-define */
import harden from '@agoric/harden';
import produceIssuer from '@agoric/ertp';
import { makeZoeHelpers } from '@agoric/zoe/src/contractSupport/zoeHelpers';

/**
 * This contract mints a NFT.
 */
export const makeContract = harden(zcf => {
  // Internal token mint for NFT
  const { issuer, mint, amountMath } = produceIssuer('invoice', 'set');

  const { inviteAnOffer } = makeZoeHelpers(zcf);

  // make the zoe helpers
  const zoeHelpers = makeZoeHelpers(zcf);

  return zcf.addNewIssuer(issuer, 'Invoice').then(() => {
    const mintHook = offerHandle => {

      const requestOffer = zcf.getOffer(offerHandle);
      const typeRequestExtent = requestOffer.proposal.want.Invoice.extent;

      const invoiceNft = amountMath.make(harden(typeRequestExtent));
      const paymentNftInvoice = mint.mintPayment(invoiceNft);

      return zoeHelpers
        .escrowAndAllocateTo({
          amount: invoiceNft,
          payment: paymentNftInvoice,
          keyword: 'Invoice',
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
        })
      ),
      publicAPI: {
        makeInvite,
        getTokenIssuer: () => issuer,
      },
    });
  });
});