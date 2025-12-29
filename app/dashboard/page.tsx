import { auth } from "@/auth";
import { FaUserGraduate, FaUserTie } from "react-icons/fa";

import { API_BASE_URL } from "@/lib/constants";

type Stats = {
    total_students: number;
    total_wali_murid: number;
};

async function getStats(token: string): Promise<Stats | null> {
    try {
        const res = await fetch(`${API_BASE_URL}/stats`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            cache: "no-store",
        });

        if (!res.ok) {
            console.error("Failed to fetch stats status:", res.status);
            return null;
        }

        return res.json();
    } catch (error) {
        console.error("Failed to fetch stats:", error);
        return null;
    }
}

export default async function DashboardPage() {
    const session = await auth();
    // @ts-ignore
    const token = session?.api_token;

    const stats = token ? await getStats(token) : null;

    return (
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Welcome Card */}
                <div className="md:col-span-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <div className="w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
                    </div>
                    <h1 className="text-3xl text-gray-900 dark:text-white mb-2">
                        Ahlan Wa Sahlan, {session?.user?.name}!
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Berikut adalah ringkasan anggota yiss
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg">
                    {/* Total Murid Card */}
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 dark:border-zinc-800 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center text-center">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full mb-6">
                            <FaUserGraduate size={40} />
                        </div>
                        <p className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                            {stats?.total_students ?? "..."}
                        </p>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Total Murid
                        </h3>
                    </div>

                    {/* Total Wali Murid Card */}
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 dark:border-zinc-800 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center text-center">
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full mb-6">
                            <FaUserTie size={40} />
                        </div>
                        <p className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                            {stats?.total_wali_murid ?? "..."}
                        </p>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Total Wali Murid
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
