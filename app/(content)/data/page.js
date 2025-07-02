import { getCollection } from '@/app/lib/db';
import DataPage from '../../components/Data'; // <-- CORRECTED PATH

export default async function DataRoutePage() {

  const productsCollection = await getCollection("products");

  let products = []; // Default to an empty array

  // It's good practice to check if the collection was successfully retrieved
  if (productsCollection) {
    try {
      // 1. Use .find({}) to get a cursor for all documents in the collection.
      // 2. Use .toArray() to convert the cursor into a plain JavaScript array.
      const rawProducts = await productsCollection.find({}).toArray();

      // 3. (CRUCIAL STEP) Serialize the data. MongoDB's _id is an object.
      // We must convert it to a string to pass it to a Client Component.
      products = rawProducts.map(product => ({
        ...product,
        _id: product._id.toString(),
      }));

    } catch (error) {
      console.error("Failed to fetch products:", error);
      // Handle the error appropriately, maybe return an error message
    }
  }

  // Now, `products` is a serializable array of objects. This will log correctly.
  console.log("products:", products);

  // The DataPage component contains everything: tabs, tables, search, etc.
  return (
    <div className="h-full dark:bg-gray-850 p-2 flex flex-col gap-6">
      <DataPage />
    </div>
  );
}