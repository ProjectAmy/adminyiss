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
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                {/* Card Murid */}
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 uppercase font-semibold tracking-wider">Total Murid</p>
                            <p className="text-4xl font-bold text-gray-800 mt-2">
                                {stats?.total_students ?? "..."}
                            </p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-full text-blue-600">
                            <FaUserGraduate size={32} />
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-400">
                        Total murid yang terdaftar di sistem
                    </div>
                </div>

                {/* Card Wali Murid */}
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 uppercase font-semibold tracking-wider">Total Wali Murid</p>
                            <p className="text-4xl font-bold text-gray-800 mt-2">
                                {stats?.total_wali_murid ?? "..."}
                            </p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-full text-green-600">
                            <FaUserTie size={32} />
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-400">
                        Total wali murid dengan akun aktif
                    </div>
                </div>
            </div>
        </div>
    );
}
