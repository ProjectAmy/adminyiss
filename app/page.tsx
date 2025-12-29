import { auth } from "@/auth";

export default async function Dashboard() {
  const session = await auth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
          Welcome to Admin Dashboard
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Hello, {session?.user?.name || "Admin"}!
        </p>
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 max-w-md mx-auto">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select an option from the menu or use the navigation links above to manage your data.
          </p>
        </div>
      </div>
    </div>
  );
}
