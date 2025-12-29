"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/lib/constants";

interface Student {
    id: number;
    fullname: string;
    grade: string;
    unit: string;
    walimurid_profile: {
        fullname: string;
    } | null;
}

export default function ListPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                // Modified to use localStorage as per user's success example and AuthTokenSync logic
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

    if (loading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Daftar Siswa & Wali Murid</h1>
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Nama Wali Murid
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Nama Anak
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Kelas Anak
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {student.walimurid_profile?.fullname || "-"}
                                </td>
                                <td className="px-6 py-4">
                                    {student.fullname}
                                </td>
                                <td className="px-6 py-4">
                                    {student.grade} {student.unit}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
