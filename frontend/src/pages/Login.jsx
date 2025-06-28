import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [email, setEmail] = useState("sharol@example.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/login", { email, password });
      const token = res.data.token;

      localStorage.setItem("token", token);

      navigate("/dashboard");
      setError("");
    } catch (err) {
      setError("Credenciales inválidas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-indigo-900">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Iniciar Sesión</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            placeholder="Correo electrónico"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="password"
            value={password}
            placeholder="Contraseña"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded-lg transition duration-200"
          >
            Iniciar sesión
          </button>
        </form>
        {error && <p className="mt-4 text-red-500 text-sm text-center">{error}</p>}
      </div>
    </div>
  );
}
