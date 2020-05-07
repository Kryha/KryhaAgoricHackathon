import produceIssuer from '@agoric/ertp';

const plasticUnitsBundle = produceIssuer('unit');
export const { issuer: plasticUnitIssuer } = plasticUnitsBundle;

// Get the mint
const plasticUnitMint = plasticUnitsBundle.mint;

// export a way to create amounts of plastic units
export const plasticUnits = plasticUnitsBundle.amountMath.make;

// create a payment for the producer to hold treasury funds.
const payment = plasticUnitMint.mintPayment(plasticUnits(10000));

const purse = plasticUnitsBundle.issuer.makeEmptyPurse();
purse.deposit(payment);

// Payment to the producer
// const paymentForProducer = purse.withdraw(plasticUnits(1000));