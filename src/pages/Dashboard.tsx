import AdminDashboard from "./AdminDashboard";
import { useAuth } from "../store/authStore";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{padding: '2rem'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h2>Panel de {user.nombre}</h2>
        <button onClick={logout} style={{padding: '8px 16px', cursor: 'pointer'}}>
          Cerrar Sesión
        </button>
      </div>

      {user.rol === 'admin' && <AdminDashboard />}
      {user.rol === 'tecnico' && <TechDashboard />}
      {user.rol === 'cliente' && <ClientDashboard />}
    </div>
  );
}

function TechDashboard() {
  return (
    <div style={{marginTop: '2rem'}}>
      <h3>Vista del Técnico</h3>
      <p>Aquí verás tus visitas asignadas e informes.</p>
    </div>
  );
}

function ClientDashboard() {
  return (
    <div style={{marginTop: '2rem'}}>
      <h3>Vista del Cliente</h3>
      <p>Aquí verás tus fincas y visitas confirmadas.</p>
    </div>
  );
}