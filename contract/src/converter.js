/* eslint-disable no-use-before-define */
import harden from '@agoric/harden';
import produceIssuer from '@agoric/ertp';
import { makeZoeHelpers } from '@agoric/zoe/src/contractSupport/zoeHelpers';

/**
 * @typedef {import('../zoe').ContractFacet} ContractFacet
 */

// zcf is the Zoe Contract Facet, i.e. the contract-facing API of Zoe
export const makeContract = harden(zcf => {
  const {
    checkHook,
    makeEmptyOffer,
    escrowAndAllocateTo,
  } = makeZoeHelpers(zcf);

  const { issuer, mint, amountMath } = produceIssuer('invoice', 'set');

  return zcf.addNewIssuer(issuer, 'Invoice').then(() => {
    const amountMaths = zcf.getAmountMaths(harden(['Invoice', 'Price']));

    const convertHook = offerHandle => {
      return makeEmptyOffer().then(burnHandle => {
        const { proposal } = zcf.getOffer(offerHandle);
        const wantedOfferProposal = proposal.want.Invoice.extent;
        const amount = amountMath.make(harden(wantedOfferProposal));
        const payment = mint.mintPayment(amount);

        return escrowAndAllocateTo({
          amount,
          payment,
          keyword: 'Invoice',
          recipientHandle: burnHandle,
        }).then(() => {
          const currentBurnAllocation = zcf.getCurrentAllocation(burnHandle);
          const currentOfferAllocation = zcf.getCurrentAllocation(offerHandle);

          const wantedBurnAllocation = {
            Invoice: amountMaths.Invoice.getEmpty(),
            Price: amountMaths.Price.add(
              currentBurnAllocation.Price,
              currentOfferAllocation.Price,
            ),
          };

          const wantedOfferAllocation = {
            Invoice: amountMaths.Invoice.add(
              currentBurnAllocation.Invoice,
              currentOfferAllocation.Invoice,
            ),
            Price: amountMaths.Price.getEmpty(),
          };

          zcf.reallocate(
            harden([burnHandle, offerHandle]),
            harden([wantedBurnAllocation, wantedOfferAllocation]),
          );

          zcf.complete(harden([offerHandle]));
          return 'Offer completed. You should receive a payment from Zoe';
        });
      });
    };

    const expectedOffer = harden({
      want: { Invoice: null },
      give: { Price: null },
    });

    const makeInvite = () => {
      return zcf.makeInvitation(checkHook(convertHook, expectedOffer), 'offer');
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
