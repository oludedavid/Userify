"use client";
import React, { useState } from "react";
import Form from "@/app/components/form";
import axios from "axios";
import Link from "next/link";

type UserData = {
  email: string;
  password: string;
  role: string;
};

export default function RegisterPage() {
  const [userData, setUserData] = useState<UserData>({
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.currentTarget.name]: e.currentTarget.value });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:8001/api/users/register",
        userData
      );

      setSuccess(response.data.message);
      setUserData({ email: "", password: "", role: "student" });
    } catch (error: any) {
      console.error(error);
      setError(
        `Registration failed. Please try again.${error.response.data.messgae}`
      );
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 4000);
    }
  };

  return (
    <main className="flex flex-col justify-center w-full items-center py-20">
      <h1 className="text-4xl font-bold py-20">Register</h1>
      {error && <p className="text-red-500">{error}</p>}
      {success && (
        <p className="text-green-500 py-3 flex flex-row justify-center items-center w-full">
          {success}.
        </p>
      )}
      <Form className="flex flex-col gap-3" handleFormSubmit={handleFormSubmit}>
        <input
          onChange={handleInputChange}
          name="email"
          type="email"
          id="email"
          placeholder="Email"
          value={userData.email}
          className="border border-solid border-red-300 w-[200px] h-[30px] rounded-sm p-2"
          required
        />
        <input
          onChange={handleInputChange}
          name="password"
          className="border border-solid border-red-300 w-[200px] h-[30px] p-2"
          type="password"
          id="password"
          placeholder="Password"
          value={userData.password}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="border-2 border-solid border-red-300 w-[100px] h-[30px] flex flex-row justify-center items-center rounded-md shadow-md hover:shadow-lg cursor-pointer hover:text-sm"
        >
          {loading ? "Loading..." : "Register"}
        </button>
        <Link href="/auth/login">
          <small className="text-red-500">Already have an account? Login</small>
        </Link>
      </Form>
    </main>
  );
}
