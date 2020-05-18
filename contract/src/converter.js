/* eslint-disable no-use-before-define */
import harden from '@agoric/harden';
import { assert, details } from '@agoric/assert';
import produceIssuer from '@agoric/ertp';
import { makeZoeHelpers } from '@agoric/zoe/src/contractSupport/zoeHelpers';

/**
 * @typedef {import('../zoe').ContractFacet} ContractFacet
 */

// zcf is the Zoe Contract Facet, i.e. the contract-facing API of Zoe
export const makeContract = harden(zcf => {
  const {
    rejectOffer,
    assertKeywords,
    checkHook,
    makeEmptyOffer,
    escrowAndAllocateTo,
  } = makeZoeHelpers(zcf);

  assertKeywords(harden(['Price']));

  const {
    terms: { conversionRate },
  } = zcf.getInstanceRecord();

  assert(
    conversionRate !== undefined,
    details`inputOutputRatio must be present`,
  );

  assert(
    conversionRate.extent >= 1,
    details`inputOutputRatio must be greater or equal to 1`,
  );

  const { issuer, mint, amountMath } = produceIssuer('asset', 'set');

  return zcf.addNewIssuer(issuer, 'Asset').then(() => {
    const amountMaths = zcf.getAmountMaths(harden(['Asset', 'Price']));

    const convertHook = offerHandle => {
      return makeEmptyOffer().then(burnHandle => {
        const { proposal } = zcf.getOffer(offerHandle);
        const assetExtent = proposal.want.Asset.extent;
        if (assetExtent.length < 1) {
          throw rejectOffer(offerHandle, `Request at least 1 Asset`);
        }

        const priceExtent = proposal.give.Price.extent;
        if (priceExtent < 1) {
          throw rejectOffer(offerHandle, `Provide a price of at least 1`);
        }

        const expectedRatio = conversionRate.extent;
        if (priceExtent !== expectedRatio * assetExtent.length) {
          throw rejectOffer(
            offerHandle,
            `Invalid input to output ratio specified, ${priceExtent}, ${assetExtent.length}, ${expectedRatio}.`,
          );
        }

        const amount = amountMath.make(harden(assetExtent));
        const payment = mint.mintPayment(amount);

        return escrowAndAllocateTo({
          amount,
          payment,
          keyword: 'Asset',
          recipientHandle: burnHandle,
        }).then(() => {
          const currentBurnAllocation = zcf.getCurrentAllocation(burnHandle);
          const currentOfferAllocation = zcf.getCurrentAllocation(offerHandle);

          const wantedBurnAllocation = {
            Asset: amountMaths.Asset.getEmpty(),
            Price: amountMaths.Price.add(
              currentBurnAllocation.Price,
              currentOfferAllocation.Price,
            ),
          };

          const wantedOfferAllocation = {
            Asset: amountMaths.Asset.add(
              currentBurnAllocation.Asset,
              currentOfferAllocation.Asset,
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
      want: { Asset: null },
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
        getConversionRate: () => conversionRate,
      },
    });
  });
});
