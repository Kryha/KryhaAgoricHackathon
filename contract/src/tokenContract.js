/* eslint-disable no-use-before-define */
import harden from '@agoric/harden';
import produceIssuer from '@agoric/ertp';
import { makeZoeHelpers } from '@agoric/zoe/src/contractSupport/zoeHelpers';

export const makeContract = harden(zcf => {
  const {
    terms: { issuerName },
  } = zcf.getInstanceRecord();

  const { issuer, amountMath } = produceIssuer('token');

  const { inviteAnOffer } = makeZoeHelpers(zcf);

  const zoeHelpers = makeZoeHelpers(zcf);

  return zcf.addNewIssuer(issuer, issuerName).then(() => {


    const makeInvite = () =>
      inviteAnOffer(
        harden({
          customProperties: { inviteDesc: 'token' },
        }),
      );


    return harden({
      invite: inviteAnOffer(
        harden({
          customProperties: { inviteDesc: 'token' },
        })
      ),
      publicAPI: {
        makeInvite,
        getTokenIssuer: () => issuer,
      },
    });
  });
});