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

  assertKeywords(harden(['Asset']));

  const {
    terms: { issuerName, conversionRate },
  } = zcf.getInstanceRecord();

  const { issuer, mint, amountMath } = produceIssuer('token');

  return zcf.addNewIssuer(issuer, issuerName).then(() => {
    const amountMaths = zcf.getAmountMaths(harden(['Asset', issuerName]));

    const decomposeHook = offerHandle => {
      return makeEmptyOffer().then(burnHandle => {
        const { proposal } = zcf.getOffer(offerHandle);
        const tokenExtent = proposal.want[issuerName].extent;
        if (tokenExtent < 1) {
          throw rejectOffer(offerHandle, `Request at least 1 ${issuerName}`);
        }

        const assetExtent = proposal.give.Asset.extent;
        if (assetExtent.length < 1) {
          throw rejectOffer(offerHandle, `Provide at least 1 Asset`);
        }

        const expectedRatio = conversionRate;
        if (assetExtent.length * expectedRatio !== tokenExtent) {
          throw rejectOffer(
            offerHandle,
            `Invalid conversion rate specified, conversion rate should be: ${expectedRatio}.`,
          );
        }

        const amount = amountMath.make(harden(tokenExtent));
        const payment = mint.mintPayment(amount);

        return escrowAndAllocateTo({
          amount,
          payment,
          keyword: issuerName,
          recipientHandle: burnHandle,
        }).then(() => {
          const currentBurnAllocation = zcf.getCurrentAllocation(burnHandle);
          const currentOfferAllocation = zcf.getCurrentAllocation(offerHandle);

          const wantedBurnAllocation = {
            Asset: currentOfferAllocation.Asset,
            [issuerName]: amountMaths[issuerName].getEmpty(),
          };

          const wantedOfferAllocation = {
            Asset: amountMaths.Asset.getEmpty(),
            [issuerName]: currentBurnAllocation[issuerName],
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
      want: { [issuerName]: null },
      give: { Asset: null },
    });

    const makeInvite = () => {
      return zcf.makeInvitation(
        checkHook(decomposeHook, expectedOffer),
        'offer',
      );
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
