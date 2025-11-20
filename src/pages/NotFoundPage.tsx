import type React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";

export const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center',
            padding: '2rem'
        }}>
            <h1 style={{ fontSize: '6rem', margin: 0, color: '#193c1e'}}>404</h1>
            <h2 style={{marginBottom: '1rem'}}>Página no encontrada</h2>
            <p style={{ marginBottom: '2rem', color: '#666'}}>La página que buscas no existe</p>
            <Button onClick={() => navigate('/')}>
                Volver al inicio
            </Button>
        </div>
    );
};