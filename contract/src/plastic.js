/* eslint-disable no-use-before-define */
import harden from '@agoric/harden';
import produceIssuer from '@agoric/ertp';
import {
  makeZoeHelpers,
  defaultAcceptanceMsg,
} from '@agoric/zoe/src/contractSupport/zoeHelpers';

/*
  Roles in the arrangement:
  - Contract creator: describes the contract with:
    - number of seats, show, date/time of start
    - expected (ERTP) amount per ticket (we assume all tickets cost the same)
  - Smart Contract:
    - mints the tickets
    - provides the seats
  - Auditorium (unique contract seat, usually taken by the contract creator):
    the person hosting
  the Opera show, selling the tickets and getting the payment back
  - Ticket buyers (contract seat created on demand):
    - can see the available opera show seats
    - can consult the terms
    - can redeem the zoe invite with the proper payment to get the ticket back

  ERTP and Zoe are considered to be the most highly trusted pieces of code by
  everyone
  They are more trusted than the code of this contract
  As a consequence, they are going to be leveraged as much as possible by this
  contract
  to increase its trustworthiness and by the contract users

*/

// zcf is the Zoe Contract Facet, i.e. the contract-facing API of Zoe
export const makeContract = harden(zcf => {
  // Create the internal ticket mint
  const { issuer, mint, amountMath: ticketAmountMath } = produceIssuer(
    'Plastic',
    'set',
  );

  const types = ['A', 'B'];
  const plasticType = types[Math.floor(Math.random() * types.length)];

  const {
    terms: { type, expectedUnitsPerPlastic },
    issuerKeywordRecord: { Unit: unitIssuer },
  } = zcf.getInstanceRecord();

  const { amountMath: unitAmountMath } = zcf.getIssuerRecord(unitIssuer);

  const { rejectOffer, checkHook, escrowAndAllocateTo } = makeZoeHelpers(zcf);

  let producerOfferHandle;

  return zcf.addNewIssuer(issuer, 'Plastic').then(() => {
    // Mint tickets inside the contract
    // In a more realistic contract, the Auditorium would certainly mint the
    // tickets themselves
    // but because of a current technical limitation when running the Agoric
    // stack on a blockchain,
    // minting has to happen inside a Zoe contract
    // https://github.com/Agoric/agoric-sdk/issues/821

    // Mint the tickets ahead-of-time (instead of on-demand)
    // This way, they can be passed to Zoe + ERTP who will be doing the
    // bookkeeping
    // of which tickets have been sold and which tickets are still for sale
    const plasticAmount = unitAmountMath.make(
      harden({
        type: plasticType,
        expectedUnitsPerPlastic: 50,
      }),
    );
    const plasticPayment = mint.mintPayment(plasticAmount);

    const producerOfferHook = offerHandle => {
      producerOfferHandle = offerHandle;
      return escrowAndAllocateTo({
        amount: plasticAmount,
        payment: plasticPayment,
        keyword: 'Plastic',
        recipientHandle: producerOfferHandle,
      }).then(() => defaultAcceptanceMsg);
    };

    const convertOfferHook = buyerOfferHandle => {
      const buyerOffer = zcf.getOffer(buyerOfferHandle);

      const currentProducerAllocation = zcf.getCurrentAllocation(
        producerOfferHandle,
      );
      const currentConverterAllocation = zcf.getCurrentAllocation(
        buyerOfferHandle,
      );

      // const wantedPlasticType = buyerOffer.proposal.want.Plastic.type;
      const wantedUnitsCount = 50;
      const wantedUnits = expectedUnitsPerPlastic.extent * wantedUnitsCount;

      try {
        if (
          !unitAmountMath.isGTE(
            currentConverterAllocation.Unit,
            unitAmountMath.make(wantedUnits),
          )
        ) {
          throw new Error(
            'The offer associated with this plastic does not contain enough units',
          );
        }
        if (!currentConverterAllocation.type === 'A' || 'B') {
          throw new Error(
            'The offer associated with this plastic does not contain the correct type',
          );
        }

        const wantedProducerAllocation = {
          Unit: unitAmountMath.add(
            currentProducerAllocation.Unit,
            currentConverterAllocation.Unit,
          ),
          Plastic: unitAmountMath.subtract(
            currentProducerAllocation.Plastic.type,
            buyerOffer.proposal.want.Plastic.type,
          ),
        };

        const wantedConverterAllocation = {
          Unit: unitAmountMath.getEmpty(),
          Plastic: ticketAmountMath.add(
            currentProducerAllocation.Plastic.type,
            buyerOffer.proposal.want.Plastic.type,
          ),
        };

        zcf.reallocate(
          [producerOfferHandle, buyerOfferHandle],
          [wantedProducerAllocation, wantedConverterAllocation],
        );
        zcf.complete([buyerOfferHandle]);
      } catch (err) {
        // amounts don't match or reallocate certainly failed
        rejectOffer(buyerOfferHandle);
      }
    };

    const convertPlasticExpected = harden({
      want: { Plastic: null, type: 'A' || 'B' },
      give: { Unit: null },
    });

    return harden({
      invite: zcf.makeInvitation(producerOfferHook, 'producer'),
      publicAPI: {
        makeBuyerInvite: () =>
          zcf.makeInvitation(
            checkHook(convertOfferHook, convertPlasticExpected),
            'buy ticket',
          ),
        getTicketIssuer: () => issuer,
        // eslint-disable-next-line prettier/prettier
        getAvailableTickets () {
          // Because of a technical limitation in @agoric/marshal, an array of extents
          // is better than a Map https://github.com/Agoric/agoric-sdk/issues/838
          return zcf.getCurrentAllocation(producerOfferHandle).Ticket.extent;
        },
      },
    });
  });
});
