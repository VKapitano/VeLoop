import { getCollection } from '@/app/lib/db';
import DataPage from '../../components/Data';

export default async function DataRoutePage() {
  // --- Fetch Products ---
  const productsCollection = await getCollection("products");
  let products = [];
  if (productsCollection) {
    try {
      const rawProducts = await productsCollection.find({}).toArray();
      products = rawProducts.map(product => ({
        ...product,
        _id: product._id.toString(),
      }));
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  }

  // --- Fetch Stores (NEW) ---
  const storesCollection = await getCollection("stores");
  let stores = [];
  if (storesCollection) {
    try {
      const rawStores = await storesCollection.find({}).toArray();
      stores = rawStores.map(store => ({
        ...store,
        _id: store._id.toString(),
      }));
    } catch (error) {
      console.error("Failed to fetch stores:", error);
    }
  }

  // This will log the data on the SERVER console during the build/render process.
  console.log(`Fetched ${products.length} products and ${stores.length} stores.`);

  return (
    <div className="h-full dark:bg-gray-850 p-2 flex flex-col gap-6">
      {/* Pass the fetched data as props to the client component */}
      <DataPage initialProducts={products} initialStores={stores} />
    </div>
  );
}