"use client";

import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from "@/lib/constants";
import { IoSearchOutline, IoChevronDown, IoCloseCircle } from "react-icons/io5";

interface Walimurid {
    id: number;
    fullname: string;
}

export default function AddStudentPage() {
    const [formData, setFormData] = useState({
        fullname: '',
        walimurid_profile_id: '',
        nis: '',
        unit: '',
        grade: ''
    });

    // Autocomplete states
    const [walimurids, setWalimurids] = useState<Walimurid[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoadingWalimurids, setIsLoadingWalimurids] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [status, setStatus] = useState<{
        loading: boolean;
        error: string | null;
        success: string | null;
    }>({
        loading: false,
        error: null,
        success: null
    });

    // Fetch walimurids on mount
    useEffect(() => {
        const fetchWalimurids = async () => {
            setIsLoadingWalimurids(true);
            try {
                const token = localStorage.getItem("auth_token");
                const response = await fetch(`${API_BASE_URL}/walimurid`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setWalimurids(data);
                } else {
                    console.error('Failed to fetch walimurid data');
                }
            } catch (error) {
                console.error('Error fetching walimurids:', error);
            } finally {
                setIsLoadingWalimurids(false);
            }
        };

        fetchWalimurids();
    }, []);

    // Filter walimurids based on search
    const filteredWalimurids = walimurids.filter(wali =>
        wali.fullname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleWaliSelect = (wali: Walimurid) => {
        setFormData(prev => ({ ...prev, walimurid_profile_id: wali.id.toString() }));
        setSearchQuery(wali.fullname);
        setIsDropdownOpen(false);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setIsDropdownOpen(true);
        // Clear walimurid_profile_id if user types something new
        if (formData.walimurid_profile_id) {
            setFormData(prev => ({ ...prev, walimurid_profile_id: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.walimurid_profile_id) {
            setStatus({ loading: false, error: 'Silahkan pilih Wali Murid dari daftar', success: null });
            return;
        }

        setStatus({ loading: true, error: null, success: null });

        try {
            const token = localStorage.getItem("auth_token");

            const response = await fetch(`${API_BASE_URL}/students`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    fullname: formData.fullname,
                    walimurid_profile_id: Number(formData.walimurid_profile_id),
                    nis: formData.nis,
                    unit: formData.unit,
                    grade: formData.grade
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Error: ${response.statusText}`);
            }

            setStatus({ loading: false, error: null, success: 'Siswa berhasil ditambahkan!' });
            // Reset form
            setFormData({
                fullname: '',
                walimurid_profile_id: '',
                nis: '',
                unit: '',
                grade: ''
            });
            setSearchQuery('');
        } catch (err: any) {
            setStatus({ loading: false, error: err.message || 'Gagal menambahkan siswa', success: null });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-8">
            <div className="max-w-2xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Tambah Siswa Baru</h1>
                    <p className="mt-2 text-gray-600">Masukkan detail siswa di bawah ini.</p>
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
                        {/* Nama Anak */}
                        <div className="space-y-2">
                            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
                                Nama Anak
                            </label>
                            <input
                                type="text"
                                id="fullname"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none hover:border-blue-200"
                                placeholder="Nama Lengkap Siswa"
                            />
                        </div>

                        {/* Autocomplete Wali Murid Field */}
                        <div className="space-y-2 relative" ref={dropdownRef}>
                            <label htmlFor="wali_search" className="block text-sm font-medium text-gray-700">
                                Nama Orang Tua (Wali Murid)
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="wali_search"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onFocus={() => setIsDropdownOpen(true)}
                                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none hover:border-blue-200"
                                    placeholder="Cari nama wali murid..."
                                    autoComplete="off"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    {isLoadingWalimurids ? (
                                        <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
                                    ) : searchQuery ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearchQuery('');
                                                setFormData(prev => ({ ...prev, walimurid_profile_id: '' }));
                                                setIsDropdownOpen(true);
                                            }}
                                            className="hover:text-gray-600"
                                        >
                                            <IoCloseCircle className="w-5 h-5" />
                                        </button>
                                    ) : (
                                        <IoSearchOutline className="w-5 h-5" />
                                    )}
                                </div>
                            </div>

                            {/* Hidden Input for actual ID */}
                            <input
                                type="hidden"
                                name="walimurid_profile_id"
                                value={formData.walimurid_profile_id}
                                required
                            />

                            {/* Dropdown List */}
                            {isDropdownOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                                    {filteredWalimurids.length > 0 ? (
                                        <ul className="py-1">
                                            {filteredWalimurids.map((wali) => (
                                                <li
                                                    key={wali.id}
                                                    onClick={() => handleWaliSelect(wali)}
                                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-700 transition-colors duration-150 flex items-center justify-between group"
                                                >
                                                    <span className="font-medium">{wali.fullname}</span>
                                                    {formData.walimurid_profile_id === wali.id.toString() && (
                                                        <span className="text-blue-600 text-sm font-semibold">Terpilih</span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="px-4 py-3 text-gray-500 text-center text-sm">
                                            {isLoadingWalimurids ? 'Memuat...' : 'Tidak ditemukan nama wali'}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* NIS */}
                        <div className="space-y-2">
                            <label htmlFor="nis" className="block text-sm font-medium text-gray-700">
                                NIS (Nomor Induk Siswa)
                            </label>
                            <input
                                type="text"
                                id="nis"
                                name="nis"
                                value={formData.nis}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none hover:border-blue-200"
                                placeholder="Contoh: 12345"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Unit */}
                            <div className="space-y-2">
                                <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                                    Jenjang
                                </label>
                                <select
                                    id="unit"
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none hover:border-blue-200 bg-white"
                                >
                                    <option value="">Pilih Jenjang</option>
                                    <option value="TK">TK</option>
                                    <option value="SD">SD</option>
                                    <option value="SMP">SMP</option>
                                    <option value="SMA">SMA</option>
                                </select>
                            </div>

                            {/* Kelas */}
                            <div className="space-y-2">
                                <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                                    Kelas
                                </label>
                                <input
                                    type="text"
                                    id="grade"
                                    name="grade"
                                    value={formData.grade}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none hover:border-blue-200"
                                    placeholder="Contoh: 1A"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={status.loading || !formData.walimurid_profile_id}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {status.loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Menyimpan...
                                    </>
                                ) : (
                                    'Simpan Data Siswa'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
