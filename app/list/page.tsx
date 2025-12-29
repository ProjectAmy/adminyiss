"use client";

import { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/lib/constants";
import { FiUser, FiUsers, FiBook, FiSearch, FiFilter } from "react-icons/fi";
import { clsx } from "clsx";

interface Student {
    id: number;
    fullname: string;
    grade: string;
    unit: string;
    walimurid_profile: {
        fullname: string;
    } | null;
}

type TabType = "murid" | "guru" | "karyawan";

export default function ListPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>("murid");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const token = localStorage.getItem("auth_token");
                const response = await fetch(`${API_BASE_URL}/students`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch students");
                }

                const data = await response.json();
                setStudents(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const filteredStudents = useMemo(() => {
        if (!searchQuery) return students;
        const lowerQuery = searchQuery.toLowerCase();
        return students.filter(student =>
            student.fullname.toLowerCase().includes(lowerQuery) ||
            student.walimurid_profile?.fullname.toLowerCase().includes(lowerQuery)
        );
    }, [students, searchQuery]);

    const tabs: { id: TabType; label: string; count: number }[] = [
        { id: "murid", label: "Murid", count: students.length },
        { id: "guru", label: "Guru", count: 0 },
        { id: "karyawan", label: "Karyawan", count: 0 },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="max-w-5xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Daftar Data</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Kelola data murid, guru, dan karyawan.</p>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    placeholder="Cari nama murid atau wali..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6 overflow-x-auto">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={clsx(
                                activeTab === tab.id
                                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-700",
                                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors"
                            )}
                        >
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={clsx(
                                    "py-0.5 px-2.5 rounded-full text-xs font-medium",
                                    activeTab === tab.id ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300" : "bg-gray-100 text-gray-900 dark:bg-zinc-800 dark:text-gray-300"
                                )}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div className="space-y-4">
                {activeTab === "murid" ? (
                    filteredStudents.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                            <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center bg-gray-50 rounded-full mb-4">
                                <FiFilter className="w-6 h-6" />
                            </div>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada data murid</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {searchQuery ? "Tidak ditemukan murid dengan nama tersebut." : "Belum ada data murid yang terdaftar."}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredStudents.map((student) => (
                                <div
                                    key={student.id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md flex flex-col gap-4"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                                                <FiUser className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">{student.fullname}</h3>
                                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                                    <FiBook className="w-3 h-3" />
                                                    {student.grade} - {student.unit}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-50">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <FiUsers className="w-4 h-4 text-gray-400" />
                                            <span className="font-medium">Ortu:</span>
                                            <span>{student.walimurid_profile?.fullname || "-"}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                        <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center bg-gray-50 rounded-full mb-4">
                            <FiFilter className="w-6 h-6" />
                        </div>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Data {activeTab === "guru" ? "Guru" : "Karyawan"} Kosong</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Fitur ini belum tersedia atau belum ada data.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
