"use client";
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import Link from "next/link";

interface User {
  email: string;
  role: string;
  permissions: string[];
}

const cookies = new Cookies();

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userCookie = cookies.get("USER") as User | undefined;
    if (userCookie) {
      setUser(userCookie);
    }
  }, []);

  // logout
  const logout = () => {
    cookies.remove("TOKEN", { path: "/" });
    cookies.remove("USER", { path: "/" });
    window.location.href = "/";
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg text-center">
        {user ? (
          <div>
            <h1 className="text-2xl font-semibold mb-4">
              Welcome back, <span className="text-blue-600">{user.email}</span>!
            </h1>
            <button
              onClick={logout}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
            >
              Logout
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-semibold mb-4">
              You are not logged in.
            </h1>
            <Link href="/auth/login">
              <p className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                Login
              </p>
            </Link>
          </div>
        )}
      </div>
      <h2 className="text-xl font-bold mt-6 text-gray-800">
        Welcome to Userify
      </h2>
    </main>
  );
}
