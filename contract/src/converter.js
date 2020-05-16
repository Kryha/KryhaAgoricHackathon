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

  const { issuer, mint, amountMath } = produceIssuer('plastic', 'set');

  return zcf.addNewIssuer(issuer, 'Plastic').then(() => {
    const amountMaths = zcf.getAmountMaths(harden(['Plastic', 'Price']));

    const convertHook = offerHandle => {
      return makeEmptyOffer().then(burnHandle => {
        const { proposal } = zcf.getOffer(offerHandle);
        const wantedOfferProposal = proposal.want.Plastic.extent;
        const amount = amountMath.make(harden(wantedOfferProposal));
        const payment = mint.mintPayment(amount);

        return escrowAndAllocateTo({
          amount,
          payment,
          keyword: 'Plastic',
          recipientHandle: burnHandle,
        }).then(() => {
          const currentBurnAllocation = zcf.getCurrentAllocation(burnHandle);
          const currentOfferAllocation = zcf.getCurrentAllocation(offerHandle);

          const wantedBurnAllocation = {
            Plastic: amountMaths.Plastic.getEmpty(),
            Price: amountMaths.Price.add(
              currentBurnAllocation.Price,
              currentOfferAllocation.Price,
            ),
          };

          const wantedOfferAllocation = {
            Plastic: amountMaths.Plastic.add(
              currentBurnAllocation.Plastic,
              currentOfferAllocation.Plastic,
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
      want: { Plastic: null },
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