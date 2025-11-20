import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const navigate = useNavigate();
    return(
        <div className='admin-container'>
            <h2>Panel del Administrador</h2>

            <div className='admin-grid'>
                <section className='admin-card'>
                    <h3>Clientes</h3>
                    <p>Gestión de clientes y sus datos.</p>
                    <button onClick={() => navigate('/clientes')}>Ver clientes</button>
                </section>
                
                <section className='admin-card'>
                    <h3>Fincas</h3>
                    <p>Lista de fincas por cliente.</p>
                    <button>Ver fincas</button>
                </section>
                
                <section className='admin-card'>
                    <h3>Visitas</h3>
                    <p>Programar y asginar visitas.</p>
                    <button onClick={() => navigate('/visitas')}>Ver visitas</button>
                </section>
            </div>
        </div>
    ) 
}