import { useEffect, useState } from "react";
import API from "../services/api";
import ClientePanel from "./ClientePanel";
import ProveedorPanel from "./ProveedorPanel";
import AdminPanel from "./AdminPanel";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
      return;
    }

    API.get("/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/";
      });
  }, []);

  if (!user) return <p>Cargando...</p>;

  const renderPanel = () => {
    switch (user.role) {
      case "cliente":
        return <ClientePanel />;
      case "proveedor":
        return <ProveedorPanel />;
      case "admin":
        return <AdminPanel />;
      default:
        return <p>Rol desconocido</p>;
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Bienvenido, {user.name}!</h2>
      <p>Tu rol es: <strong>{user.role}</strong></p>
      <p>Email: {user.email}</p>
      <hr />
      {renderPanel()}
    </div>
  );
}
