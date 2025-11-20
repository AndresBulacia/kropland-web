import React, { useState } from 'react';
import { type Cliente } from '../../types';
import { Input, Select, Textarea } from '../common/Input';
import { Button } from '../common/Button';
import './ClienteForm.css';

interface ClienteFormProps {
  cliente?: Cliente;
  onSubmit: (data: Omit<Cliente, 'id' | 'fechaAlta'>) => void;
  onCancel: () => void;
}

const provinciasEspana = [
  'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz', 
  'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ciudad Real',
  'Córdoba', 'Cuenca', 'Girona', 'Granada', 'Guadalajara', 'Guipúzcoa', 'Huelva',
  'Huesca', 'Islas Baleares', 'Jaén', 'La Coruña', 'La Rioja', 'Las Palmas', 'León',
  'Lérida', 'Lugo', 'Madrid', 'Málaga', 'Murcia', 'Navarra', 'Ourense', 'Palencia',
  'Pontevedra', 'Salamanca', 'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Santa Cruz de Tenerife',
  'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza'
];

export const ClienteForm: React.FC<ClienteFormProps> = ({
  cliente,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    nombre: cliente?.nombre || '',
    apellidos: cliente?.apellidos || '',
    dni: cliente?.dni || '',
    telefono: cliente?.telefono || '',
    email: cliente?.email || '',
    poblacion: cliente?.poblacion || '',
    provincia: cliente?.provincia || '',
    comunidadAutonoma: cliente?.comunidadAutonoma || '',
    codigoPostal: cliente?.codigoPostal || '',
    direccion: cliente?.direccion || '',
    notas: cliente?.notas || '',
    tecnicoAsignado: cliente?.tecnicoAsignado,
    activo: cliente?.activo ?? true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando se modifica
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Los apellidos son obligatorios';
    }
    if (!formData.dni.trim()) {
      newErrors.dni = 'El DNI es obligatorio';
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    if (!formData.poblacion.trim()) {
      newErrors.poblacion = 'La población es obligatoria';
    }
    if (!formData.provincia) {
      newErrors.provincia = 'La provincia es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);
    
    // Simular delay de red
    setTimeout(() => {
      onSubmit(formData);
      setLoading(false);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="cliente-form">
      <div className="cliente-form__section">
        <h3 className="cliente-form__section-title">Información Personal</h3>
        
        <div className="cliente-form__row">
          <Input
            label="Nombre *"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            error={errors.nombre}
            fullWidth
            placeholder="Ej: Juan"
          />
          
          <Input
            label="Apellidos *"
            value={formData.apellidos}
            onChange={(e) => handleChange('apellidos', e.target.value)}
            error={errors.apellidos}
            fullWidth
            placeholder="Ej: García Martínez"
          />
        </div>

        <div className="cliente-form__row">
          <Input
            label="DNI/NIE *"
            value={formData.dni}
            onChange={(e) => handleChange('dni', e.target.value)}
            error={errors.dni}
            fullWidth
            placeholder="Ej: 12345678A"
          />
        </div>
      </div>

      <div className="cliente-form__section">
        <h3 className="cliente-form__section-title">Información de Contacto</h3>
        
        <div className="cliente-form__row">
          <Input
            label="Teléfono *"
            type="tel"
            value={formData.telefono}
            onChange={(e) => handleChange('telefono', e.target.value)}
            error={errors.telefono}
            fullWidth
            placeholder="Ej: 600123456"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            }
          />
          
          <Input
            label="Email *"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            fullWidth
            placeholder="Ej: cliente@email.com"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
        </div>
      </div>

      <div className="cliente-form__section">
        <h3 className="cliente-form__section-title">Dirección</h3>
        
        <Input
          label="Dirección"
          value={formData.direccion}
          onChange={(e) => handleChange('direccion', e.target.value)}
          fullWidth
          placeholder="Ej: Calle Principal, 123"
        />
        
        <div className="cliente-form__row">
          <Input
            label="Población *"
            value={formData.poblacion}
            onChange={(e) => handleChange('poblacion', e.target.value)}
            error={errors.poblacion}
            fullWidth
            placeholder="Ej: Ciudad Real"
          />
          
          <Select
            label="Provincia *"
            value={formData.provincia}
            onChange={(e) => handleChange('provincia', e.target.value)}
            error={errors.provincia}
            fullWidth
            options={[
              { value: '', label: 'Seleccionar provincia' },
              ...provinciasEspana.map(p => ({ value: p, label: p }))
            ]}
          />
        </div>

        <div className="cliente-form__row">
          <Input
            label="Comunidad Autónoma"
            value={formData.comunidadAutonoma}
            onChange={(e) => handleChange('comunidadAutonoma', e.target.value)}
            fullWidth
            placeholder="Ej: Castilla-La Mancha"
          />
          
          <Input
            label="Código Postal"
            value={formData.codigoPostal}
            onChange={(e) => handleChange('codigoPostal', e.target.value)}
            fullWidth
            placeholder="Ej: 13001"
            maxLength={5}
          />
        </div>
      </div>

      <div className="cliente-form__section">
        <h3 className="cliente-form__section-title">Información Adicional</h3>
        
        <Textarea
          label="Notas"
          value={formData.notas}
          onChange={(e) => handleChange('notas', e.target.value)}
          fullWidth
          rows={4}
          placeholder="Observaciones, preferencias, etc..."
        />

        <div className="cliente-form__checkbox">
          <input
            type="checkbox"
            id="activo"
            checked={formData.activo}
            onChange={(e) => handleChange('activo', e.target.checked)}
          />
          <label htmlFor="activo">Cliente activo</label>
        </div>
      </div>

      <div className="cliente-form__actions">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          }
        >
          {cliente ? 'Actualizar' : 'Crear'} Cliente
        </Button>
      </div>
    </form>
  );
};