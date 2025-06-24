import { useState } from "react";
import API from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("sharol@example.com");
  const [password, setPassword] = useState("123456");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/login", { email, password });
      setToken(res.data.token);
      setError("");
    } catch (err) {
      setError("Credenciales inválidas");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          placeholder="Correo"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          value={password}
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Iniciar sesión</button>
      </form>
      {token && (
        <div style={{ marginTop: "1rem" }}>
          <strong>Token:</strong>
          <pre>{token}</pre>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
