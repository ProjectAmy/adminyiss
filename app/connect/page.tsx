"use client";

import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from "@/lib/constants";
import { IoSearchOutline, IoCloseCircle } from "react-icons/io5";

interface Walimurid {
    id: number;
    fullname: string;
}

interface Student {
    id: number;
    fullname: string;
}

export default function ConnectPage() {
    const [formData, setFormData] = useState({
        walimurid_profile_id: '',
        student_id: ''
    });

    // Autocomplete Data
    const [walimurids, setWalimurids] = useState<Walimurid[]>([]);
    const [students, setStudents] = useState<Student[]>([]);

    // Search States
    const [waliSearchQuery, setWaliSearchQuery] = useState('');
    const [studentSearchQuery, setStudentSearchQuery] = useState('');

    // Dropdown Visibility
    const [isWaliDropdownOpen, setIsWaliDropdownOpen] = useState(false);
    const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false);

    // Loading States
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [status, setStatus] = useState<{
        loading: boolean;
        error: string | null;
        success: string | null;
    }>({
        loading: false,
        error: null,
        success: null
    });

    const waliDropdownRef = useRef<HTMLDivElement>(null);
    const studentDropdownRef = useRef<HTMLDivElement>(null);

    // Fetch Initial Data
    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingData(true);
            try {
                const token = localStorage.getItem("auth_token");
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                };

                const [waliRes, studentRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/walimurid`, { headers }),
                    fetch(`${API_BASE_URL}/students/unconnected`, { headers })
                ]);

                if (waliRes.ok) {
                    setWalimurids(await waliRes.json());
                }

                if (studentRes.ok) {
                    setStudents(await studentRes.json());
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setStatus(prev => ({ ...prev, error: 'Gagal memuat data' }));
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchData();
    }, []);

    // Click Outside Handlers
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (waliDropdownRef.current && !waliDropdownRef.current.contains(event.target as Node)) {
                setIsWaliDropdownOpen(false);
            }
            if (studentDropdownRef.current && !studentDropdownRef.current.contains(event.target as Node)) {
                setIsStudentDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter Logic
    const filteredWalimurids = walimurids.filter(wali =>
        wali.fullname.toLowerCase().includes(waliSearchQuery.toLowerCase())
    );

    const filteredStudents = students.filter(student =>
        student.fullname.toLowerCase().includes(studentSearchQuery.toLowerCase())
    );

    // Selection Handlers
    const handleWaliSelect = (wali: Walimurid) => {
        setFormData(prev => ({ ...prev, walimurid_profile_id: wali.id.toString() }));
        setWaliSearchQuery(wali.fullname);
        setIsWaliDropdownOpen(false);
    };

    const handleStudentSelect = (student: Student) => {
        setFormData(prev => ({ ...prev, student_id: student.id.toString() }));
        setStudentSearchQuery(student.fullname);
        setIsStudentDropdownOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.walimurid_profile_id || !formData.student_id) {
            setStatus({ loading: false, error: 'Silahkan lengkapi data', success: null });
            return;
        }

        setStatus({ loading: true, error: null, success: null });

        try {
            const token = localStorage.getItem("auth_token");
            const response = await fetch(`${API_BASE_URL}/students/connect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    walimurid_profile_id: formData.walimurid_profile_id,
                    student_id: formData.student_id
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Gagal menghubungkan data');
            }

            setStatus({ loading: false, error: null, success: 'Berhasil menghubungkan Murid dan Wali!' });

            // Remove connected student from list
            setStudents(prev => prev.filter(s => s.id.toString() !== formData.student_id));

            // Reset Student form only, keep Wali (convenience) or reset all? 
            // Resetting all for clarity
            setFormData({ walimurid_profile_id: '', student_id: '' });
            setWaliSearchQuery('');
            setStudentSearchQuery('');

        } catch (error: any) {
            setStatus({ loading: false, error: error.message, success: null });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-8">
            <div className="max-w-2xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Hubungkan Data</h1>
                    <p className="mt-2 text-gray-600">Halaman ini berfungsi menghubungkan murid dan wali nya di database.</p>
                </header>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    {status.success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            {status.success}
                        </div>
                    )}

                    {status.error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {status.error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nama Wali Input */}
                        <div className="space-y-2 relative" ref={waliDropdownRef}>
                            <label className="block text-sm font-medium text-gray-700">Nama Wali</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={waliSearchQuery}
                                    onChange={(e) => {
                                        setWaliSearchQuery(e.target.value);
                                        setFormData(prev => ({ ...prev, walimurid_profile_id: '' }));
                                        setIsWaliDropdownOpen(true);
                                    }}
                                    onFocus={() => setIsWaliDropdownOpen(true)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none hover:border-blue-200 placeholder-gray-400"
                                    placeholder="Cari nama wali murid..."
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    {isLoadingData ? (
                                        <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
                                    ) : waliSearchQuery ? (
                                        <button type="button" onClick={() => { setWaliSearchQuery(''); setFormData(prev => ({ ...prev, walimurid_profile_id: '' })); }}>
                                            <IoCloseCircle className="w-5 h-5" />
                                        </button>
                                    ) : <IoSearchOutline className="w-5 h-5" />}
                                </div>
                            </div>

                            {isWaliDropdownOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                                    {filteredWalimurids.length > 0 ? (
                                        <ul className="py-1">
                                            {filteredWalimurids.map(wali => (
                                                <li
                                                    key={wali.id}
                                                    onClick={() => handleWaliSelect(wali)}
                                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-700 flex justify-between items-center"
                                                >
                                                    <span>{wali.fullname}</span>
                                                    {formData.walimurid_profile_id === wali.id.toString() && <span className="text-blue-600 text-sm">Terpilih</span>}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="px-4 py-3 text-gray-500 text-center text-sm">Tidak ditemukan</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Nama Murid Input */}
                        <div className="space-y-2 relative" ref={studentDropdownRef}>
                            <label className="block text-sm font-medium text-gray-700">Nama Murid</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={studentSearchQuery}
                                    onChange={(e) => {
                                        setStudentSearchQuery(e.target.value);
                                        setFormData(prev => ({ ...prev, student_id: '' }));
                                        setIsStudentDropdownOpen(true);
                                    }}
                                    onFocus={() => setIsStudentDropdownOpen(true)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none hover:border-blue-200 placeholder-gray-400"
                                    placeholder="Cari nama murid yang belum terkoneksi..."
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    {isLoadingData ? (
                                        <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
                                    ) : studentSearchQuery ? (
                                        <button type="button" onClick={() => { setStudentSearchQuery(''); setFormData(prev => ({ ...prev, student_id: '' })); }}>
                                            <IoCloseCircle className="w-5 h-5" />
                                        </button>
                                    ) : <IoSearchOutline className="w-5 h-5" />}
                                </div>
                            </div>

                            {isStudentDropdownOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                                    {filteredStudents.length > 0 ? (
                                        <ul className="py-1">
                                            {filteredStudents.map(student => (
                                                <li
                                                    key={student.id}
                                                    onClick={() => handleStudentSelect(student)}
                                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-700 flex justify-between items-center"
                                                >
                                                    <span>{student.fullname}</span>
                                                    {formData.student_id === student.id.toString() && <span className="text-blue-600 text-sm">Terpilih</span>}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="px-4 py-3 text-gray-500 text-center text-sm">Tidak ditemukan murid tanpa wali</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Connect Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={status.loading || !formData.walimurid_profile_id || !formData.student_id}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {status.loading ? 'Menyimpan...' : 'Connect'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
