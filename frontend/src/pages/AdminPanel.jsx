import { useEffect, useState } from "react";
import API from "../services/api";

export default function AdminPanel() {
  const [usuarios, setUsuarios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);
  const [loadingReservas, setLoadingReservas] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsuarios();
  }, []);

  useEffect(() => {
    fetchReservas();
  }, [page]);

  const fetchUsuarios = () => {
    API.get("/admin/usuarios", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setUsuarios(res.data);
        setLoadingUsuarios(false);
      })
      .catch(() => setLoadingUsuarios(false));
  };

  const fetchReservas = () => {
    API.get(`/admin/reservas?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setReservas(res.data.data);
        setLastPage(res.data.last_page);
        setLoadingReservas(false);
      })
      .catch(() => setLoadingReservas(false));
  };

  const cambiarRol = (id, nuevoRol) => {
    API.put(
      `/admin/usuarios/${id}/rol`,
      { role: nuevoRol },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => fetchUsuarios())
      .catch(() => alert("No se pudo cambiar el rol"));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>👑 Panel del Administrador</h2>

      {/* Usuarios */}
      <section style={{ marginBottom: "2rem" }}>
        <h3>Usuarios registrados</h3>
        {loadingUsuarios ? (
          <p>Cargando usuarios...</p>
        ) : usuarios.length === 0 ? (
          <p>No hay usuarios registrados.</p>
        ) : (
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Cambiar a</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><strong>{u.role}</strong></td>
                  <td>
                    {u.role !== "cliente" && (
                      <button onClick={() => cambiarRol(u.id, "cliente")}>Cliente</button>
                    )}
                    {u.role !== "proveedor" && (
                      <button onClick={() => cambiarRol(u.id, "proveedor")}>Proveedor</button>
                    )}
                    {u.role !== "admin" && (
                      <button onClick={() => cambiarRol(u.id, "admin")}>Admin</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Reservas */}
      <section>
        <h3>Reservas del sistema</h3>
        {loadingReservas ? (
          <p>Cargando reservas...</p>
        ) : reservas.length === 0 ? (
          <p>No hay reservas.</p>
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
                <br />
                Cliente: {r.cliente?.name} — {r.cliente?.email} <br />
                Proveedor: {r.proveedor?.name || "No asignado"} <br />
                <small>Creada: {new Date(r.created_at).toLocaleString()}</small>
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
      </section>
    </div>
  );
}