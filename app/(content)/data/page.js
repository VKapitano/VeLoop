import DataPage from '../../components/Data'; // <-- CORRECTED PATH

export default function DataRoutePage() {
  // The DataPage component contains everything: tabs, tables, search, etc.
  return (
    <div className="h-full dark:bg-gray-850 p-2 flex flex-col gap-6">
      <DataPage />
    </div>
  );
}