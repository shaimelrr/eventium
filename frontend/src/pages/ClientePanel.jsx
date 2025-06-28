import { useEffect, useState } from "react";
import API from "../services/api";

export default function ClientePanel() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evento, setEvento] = useState("");
  const [fecha, setFecha] = useState("");

  useEffect(() => {
    fetchReservas();
  }, []);

  const fetchReservas = () => {
    const token = localStorage.getItem("token");
    API.get("/cliente/reservas", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setReservas(res.data);
        setLoading(false);
      })
      .catch(() => {
        setReservas([]);
        setLoading(false);
      });
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!confirm("¿Estás seguro de cancelar esta reserva?")) return;

    try {
      await API.delete(`/cliente/reservas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReservas();
    } catch (err) {
      alert("No se pudo cancelar la reserva.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await API.post(
        "/cliente/reservas",
        { evento, fecha },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEvento("");
      setFecha("");
      fetchReservas();
    } catch (err) {
      alert("Error al crear la reserva");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h3>📋 Mis Reservas</h3>
      <button onClick={handleLogout}>Cerrar sesión</button>

      <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
        <h4>Nueva reserva</h4>
        <input
          type="text"
          placeholder="Nombre del evento"
          value={evento}
          onChange={(e) => setEvento(e.target.value)}
          required
        />
        <br />
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
        <br />
        <button type="submit">Crear reserva</button>
      </form>

      <hr />
      <h4>Reservas existentes</h4>
      {loading ? (
        <p>Cargando...</p>
      ) : reservas.length === 0 ? (
        <p>No tenés reservas aún.</p>
      ) : (
        <ul>
          {reservas.map((r) => (
            <li key={r.id}>
              <strong>{r.evento}</strong> — {r.fecha} —
              <span
                style={{
                  color:
                    r.estado === "confirmado"
                      ? "green"
                      : r.estado === "rechazado"
                      ? "red"
                      : "orange",
                  fontWeight: "bold",
                  marginLeft: "5px",
                }}
              >
                {r.estado}
              </span>
              {r.estado === "pendiente" && (
                <button
                  style={{ marginLeft: "1rem", color: "red" }}
                  onClick={() => handleDelete(r.id)}
                >
                  Cancelar
                </button>
              )}
              <div
                style={{
                  marginTop: "0.5rem",
                  marginLeft: "1rem",
                  fontSize: "0.9rem",
                }}
              >
                ID: {r.id} <br />
                Creada: {new Date(r.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
