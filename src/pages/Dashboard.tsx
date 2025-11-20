import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";

export default function Dashboard() {
  const navigate = useNavigate();
  const [role, setRole] = useState('');

  useEffect(() => {
    const r = localStorage.getItem('role');
    if (!r) return navigate('/login');
    setRole(r);
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{padding: '2rem'}}>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <h2>Panel de {role === 'admin' ? 'administrador' : role}</h2>
      </div>

        {role === 'admin' && <AdminDashboard />}
        {role === 'admin' && <TechDashboard />}
        {role === 'admin' && <ClientDashboard />}
    </div>
  );
}



function TechDashboard() {
  return <p>Vista del técnico (visitas asignadas, informes)</p>;
}

function ClientDashboard() {
  return <p>Vista del cliente (mis fincas, visitas confirmadas)</p>;
}