"use client";

import { FaG } from 'react-icons/fa6'
// import { signIn } from '@/auth'

export const LoginGoogleButton = () => {
    return (
        <div className="w-full">
            <button
                onClick={() => console.log("Login clicked (Auth disabled)")}
                className="flex items-center justify-center gap-2 w-full bg-blue-700 text-white font-medium py-3 px-6 text-base rounded-md hover:bg-blue-600 cursor-pointer"
            >
                <FaG className='size-6' />
                Login dengan Google
            </button>
        </div>
    )
}
