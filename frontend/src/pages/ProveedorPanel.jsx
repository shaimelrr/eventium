import { useEffect, useState } from "react";
import API from "../services/api";

export default function ProveedorPanel() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    fetchReservas();
  }, [page]);

  const fetchReservas = () => {
    const token = localStorage.getItem("token");
    API.get(`/proveedor/reservas?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        console.log(res.data);
        setReservas(res.data.data);
        setLastPage(res.data.last_page);
        setLoading(false);
      })
      .catch(() => {
        setReservas([]);
        setLoading(false);
      });
  };

  const cambiarEstado = async (id, estado) => {
    const token = localStorage.getItem("token");
    try {
      await API.put(
        `/proveedor/reservas/${id}`,
        { estado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchReservas();
    } catch {
      alert("No se pudo cambiar el estado.");
    }
  };

  const reservasFiltradas = reservas.filter(
    (r) => !estadoFiltro || r.estado === estadoFiltro
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h3>📦 Panel del Proveedor</h3>

      <label style={{ display: "block", marginBottom: "0.5rem" }}>
        Filtrar por estado:
        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          style={{ marginLeft: "0.5rem" }}
        >
          <option value="">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="confirmado">Confirmado</option>
          <option value="rechazado">Rechazado</option>
        </select>
      </label>

      {loading ? (
        <p>Cargando reservas...</p>
      ) : reservasFiltradas.length === 0 ? (
        <p>No hay reservas para mostrar.</p>
      ) : (
        <ul>
          {reservasFiltradas.map((r) => (
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
              <br />
              <p>
                Cliente: {r.cliente?.name} — {r.cliente?.email}
              </p>
              <small>
                Creada: {new Date(r.created_at).toLocaleString()}
              </small>
              <br />
              {r.estado === "pendiente" && (
                <>
                  <button
                    style={{ marginRight: "1rem" }}
                    onClick={() => cambiarEstado(r.id, "confirmado")}
                  >
                    Confirmar
                  </button>
                  <button
                    style={{ color: "red" }}
                    onClick={() => cambiarEstado(r.id, "rechazado")}
                  >
                    Rechazar
                  </button>
                </>
              )}
              <hr />
            </li>
          ))}
        </ul>
      )}

      {/* Paginación */}
      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          ⬅ Anterior
        </button>
        <span style={{ margin: "0 1rem" }}>Página {page}</span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, lastPage))}
          disabled={page === lastPage}
        >
          Siguiente ➡
        </button>
      </div>
    </div>
  );
}