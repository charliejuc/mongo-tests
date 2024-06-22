const { connectToDatabase, connectClientSingleton } = require("../../database");

(async () => {
  const client = await connectClientSingleton();
  const database = await connectToDatabase(client);

  const banksCollection = database.collection("banks");
  const productsCollection = database.collection("products");
  const transactionsCollection = database.collection("transactions");

  //   await banksCollection.createIndexes([
  //     {
  //       key: {
  //         id: 1,
  //       },
  //       unique: true,
  //     },
  //   ]);
  //   await productsCollection.createIndexes([
  //     {
  //       key: {
  //         id: 1,
  //       },
  //       unique: true,
  //     },
  //     {
  //       key: {
  //         bankId: 1,
  //       },
  //     },
  //   ]);
  //   await transactionsCollection.createIndexes([
  //     {
  //       key: {
  //         id: 1,
  //       },
  //       unique: true,
  //     },
  //     {
  //       key: {
  //         amount: 1,
  //         productId: 1,
  //       },
  //     },
  //   ]);

  //   await transactionsCollection.dropIndex("productId_1");

  const products = await productsCollection.find().limit(10).toArray();
  const productIds = products.map((product) => product.id);

  // get with an aggregate with the list of transactions with the product object
  const result = await transactionsCollection
    .aggregate([
      {
        $match: {
          productId: {
            $in: productIds,
          },
        },
      },
      // sort should be before lookup
      {
        $sort: {
          amount: 1,
        },
      },
      // limit should be as soon as possible
      {
        $limit: 1_000,
      },
      // lookup will pass to the next step ALL the input data with the new related field
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
    ])
    .explain();

  console.log(JSON.stringify(result, null, 2));
  console.log(result);

  await client.close();
})();
