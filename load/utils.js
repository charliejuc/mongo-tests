const { faker } = require("@faker-js/faker");
const { v4 } = require("uuid");

function generateBank() {
  const bankId = v4();
  const bank = {
    id: bankId,
    name: `Bank_${bankId}`,
  };

  return bank;
}

function generateProduct() {
  const productId = v4();
  const product = {
    id: productId,
    name: `Product_${productId}`,
  };

  return product;
}

function generateTransaction() {
  const transactionId = v4();
  const transaction = {
    id: transactionId,
    amount: Math.random() * 10_000,
    concept: `Transaction_${transactionId}`,
    timestamp: faker.date.between({
      from: new Date(2020, 0, 1),
      to: new Date(),
    }),
  };

  return transaction;
}

module.exports = {
  generateBank,
  generateProduct,
  generateTransaction,
};
