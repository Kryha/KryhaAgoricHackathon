import produceIssuer from '@agoric/ertp';

const plasticIssuerResults = produceIssuer('plastic');

export const plasticMint = plasticIssuerResults.mint;
export const plasticIssuer = plasticIssuerResults.issuer;
export const plasticAmountMath = plasticIssuerResults.amountMath;
