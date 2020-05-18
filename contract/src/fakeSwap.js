/* eslint-disable no-use-before-define */
import harden from '@agoric/harden';
import { makeZoeHelpers } from '@agoric/zoe/src/contractSupport/zoeHelpers';

/**
 * @typedef {import('../zoe').ContractFacet} ContractFacet
 */

// zcf is the Zoe Contract Facet, i.e. the contract-facing API of Zoe
export const makeContract = harden(zcf => {
  const { assertKeywords, checkHook } = makeZoeHelpers(zcf);
  assertKeywords(harden(['Asset', 'Price']));

  const swapHook = offerHandle => {
    zcf.complete(harden([offerHandle]));
    return 'Offer completed. You should receive a payment from Zoe';
  };

  const firstOfferExpected = harden({
    give: { Asset: null },
    want: { Price: null },
  });

  const makeInvite = () => {
    return zcf.makeInvitation(checkHook(swapHook, firstOfferExpected), 'offer');
  };

  return harden({
    invite: makeInvite(),
    publicAPI: {
      makeInvite,
    },
  });
});
