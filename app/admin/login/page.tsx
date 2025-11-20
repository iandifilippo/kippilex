"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  const response = await fetch("/api/admin-auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, password }),
  });
  if (response.ok) {
    window.location.href = "/admin/dashboard";   // ← esta línea es la clave
  } else {
    const result = await response.json();
    setError(result.message || "Credenciales inválidas");
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="p-8 bg-gray-800 rounded-lg shadow-xl w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-white">
          Acceso de Administrador Privado
        </h2>

        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        <label className="block mb-4">
          <span className="text-gray-300">Usuario</span>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="form-input mt-1 block w-full bg-gray-700 border-gray-600 text-white"
            required
          />
        </label>

        <label className="block mb-6">
          <span className="text-gray-300">Clave</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input mt-1 block w-full bg-gray-700 border-gray-600 text-white"
            required
          />
        </label>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
        >
          Entrar al Panel
        </button>
      </form>
    </div>
  );
}
