const { connectToDatabase, connectClientSingleton } = require("../database");
const {
  generateBank,
  generateProduct,
  generateTransaction,
} = require("./utils");

const banksCount = 10;
const maxProductsPerBank = 50;
const maxTransactionsPerProduct = 50_000;

async function insert(database) {
  const banksCollection = database.collection("banks");
  const transactionsCollection = database.collection("transactions");
  const productsCollection = database.collection("products");

  console.log("Starting data generation");

  const banksToInsert = [];
  const productsToInsert = [];
  let transactionsToInsert = [];

  for (let bankIndex = 0; bankIndex < banksCount; bankIndex++) {
    const bank = generateBank();

    banksToInsert.push(bank);

    const productsCount = Math.floor(Math.random() * maxProductsPerBank);
    for (let productIndex = 0; productIndex < productsCount; productIndex++) {
      const product = {
        ...generateProduct(),
        bankId: bank.id,
      };

      productsToInsert.push(product);

      const transactionsCount = Math.floor(
        Math.random() * maxTransactionsPerProduct
      );

      for (
        let transactionIndex = 0;
        transactionIndex < transactionsCount;
        transactionIndex++
      ) {
        const transaction = {
          ...generateTransaction(),
          productId: product.id,
        };

        transactionsToInsert.push(transaction);

        if (transactionsToInsert.length % 10_000 === 0) {
          await transactionsCollection.insertMany(transactionsToInsert, {
            ordered: false,
          });
          transactionsToInsert = [];

          console.log(
            `Inserted transactions batch for product ${
              productIndex + 1
            } of bank ${bankIndex + 1}`
          );
        }
      }
    }

    if (bankIndex % 10 === 0) {
      console.log(`Generated data for ${bankIndex + 1} banks...`);
    }
  }

  await banksCollection.insertMany(banksToInsert);
  await productsCollection.insertMany(productsToInsert);
  await transactionsCollection.insertMany(transactionsToInsert);

  console.log("Data generation and insertion completed");

  console.log("Banks:", await banksCollection.estimatedDocumentCount());
  console.log("Products:", await productsCollection.estimatedDocumentCount());
  console.log(
    "Transactions:",
    await transactionsCollection.estimatedDocumentCount()
  );
}

async function main() {
  const client = await connectClientSingleton();
  try {
    const database = await connectToDatabase(client);
    await insert(database);
  } catch (error) {
    console.error("Error in main execution:", error);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
