/* eslint-disable no-use-before-define */
import harden from '@agoric/harden';
import produceIssuer from '@agoric/ertp';
import { makeZoeHelpers } from '@agoric/zoe/src/contractSupport/zoeHelpers';

/**
 * This contract mints a NFT.
 */
export const makeContract = harden(zcf => {
  // Internal token mint for NFT
  const { issuer, amountMath } = produceIssuer('invoice', 'set');

  const { inviteAnOffer } = makeZoeHelpers(zcf);

  // make the zoe helpers
  const zoeHelpers = makeZoeHelpers(zcf);

  return zcf.addNewIssuer(issuer, 'Invoice').then(() => {

    const makeInvite = () =>
      inviteAnOffer(
        harden({
          customProperties: { inviteDesc: 'invoice' },
        }),
      );


    return harden({
      invite: inviteAnOffer(
        harden({
          customProperties: { inviteDesc: 'invoice' },
        })
      ),
      publicAPI: {
        makeInvite,
        getTokenIssuer: () => issuer,
      },
    });
  });
});