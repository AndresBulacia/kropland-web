import React, { useState } from 'react';
import type { Cliente } from '../../types';
import { Input, Select, Textarea } from '../common/Input';
import { Button } from '../common/Button';
import './ClienteForm.css';

interface ClienteFormProps {
  cliente?: Cliente;
  onSubmit: (data: Omit<Cliente, 'id' | 'fechaAlta'>) => void;
  onCancel: () => void;
}

// Lista de comunidades autónomas de España
const COMUNIDADES_AUTONOMAS = [
  'Andalucía',
  'Aragón',
  'Asturias',
  'Baleares',
  'Canarias',
  'Cantabria',
  'Castilla-La Mancha',
  'Castilla y León',
  'Cataluña',
  'Ceuta',
  'Comunidad de Madrid',
  'Comunidad Foral de Navarra',
  'Comunidad Valenciana',
  'Extremadura',
  'Galicia',
  'La Rioja',
  'Melilla',
  'País Vasco',
  'Región de Murcia'
];

// Lista de provincias españolas
const PROVINCIAS = [
  'A Coruña', 'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila',
  'Badajoz', 'Baleares', 'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria',
  'Castellón', 'Ceuta', 'Ciudad Real', 'Córdoba', 'Cuenca', 'Girona', 'Granada',
  'Guadalajara', 'Guipúzcoa', 'Huelva', 'Huesca', 'Jaén', 'La Rioja', 'Las Palmas',
  'León', 'Lleida', 'Lugo', 'Madrid', 'Málaga', 'Melilla', 'Murcia', 'Navarra',
  'Ourense', 'Palencia', 'Pontevedra', 'Salamanca', 'Santa Cruz de Tenerife',
  'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo', 'Valencia',
  'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza'
];

export const ClienteForm: React.FC<ClienteFormProps> = ({
  cliente,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    tipoCliente: cliente?.tipoCliente || 'Particular' as 'Particular' | 'Empresa',
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
    tecnicoAsignado: cliente?.tecnicoAsignado || '',
    activo: cliente?.activo ?? true,
    tipo: cliente?.tipo || 'Activo' as 'Activo' | 'Potencial',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

    // Nombre siempre obligatorio (sea empresa o particular)
    if (!formData.nombre.trim()) {
      newErrors.nombre = formData.tipoCliente === 'Empresa' 
        ? 'La razón social es obligatoria'
        : 'El nombre es obligatorio';
    }
    
    // Apellidos solo obligatorio para particulares
    if (formData.tipoCliente === 'Particular' && !formData.apellidos.trim()) {
      newErrors.apellidos = 'Los apellidos son obligatorios para particulares';
    }
    
    if (!formData.dni.trim()) {
      newErrors.dni = 'El DNI/CIF es obligatorio';
    }
    
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.poblacion.trim()) {
      newErrors.poblacion = 'La población es obligatoria';
    }
    
    if (!formData.provincia.trim()) {
      newErrors.provincia = 'La provincia es obligatoria';
    }
    
    if (!formData.comunidadAutonoma.trim()) {
      newErrors.comunidadAutonoma = 'La comunidad autónoma es obligatoria';
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

    const clienteData = {
      tipoCliente: formData.tipoCliente,
      nombre: formData.nombre,
      apellidos: formData.tipoCliente === 'Empresa' ? undefined : formData.apellidos,
      dni: formData.dni,
      telefono: formData.telefono,
      email: formData.email,
      poblacion: formData.poblacion,
      provincia: formData.provincia,
      comunidadAutonoma: formData.comunidadAutonoma,
      codigoPostal: formData.codigoPostal || undefined,
      direccion: formData.direccion || undefined,
      notas: formData.notas || undefined,
      tecnicoAsignado: formData.tecnicoAsignado || undefined,
      activo: formData.activo,
      tipo: formData.tipo,
    };

    setTimeout(() => {
      onSubmit(clienteData);
      setLoading(false);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="cliente-form">
      <div className="cliente-form__section">
        <h3 className="cliente-form__section-title">Información Básica</h3>
        
        <div className="cliente-form__row">
          <Select
            label="Tipo de Cliente *"
            value={formData.tipoCliente}
            onChange={(e) => handleChange('tipoCliente', e.target.value)}
            fullWidth
            options={[
              { value: 'Particular', label: 'Particular' },
              { value: 'Empresa', label: 'Empresa' }
            ]}
          />
          
          <Select
            label="Estado *"
            value={formData.tipo}
            onChange={(e) => handleChange('tipo', e.target.value)}
            fullWidth
            options={[
              { value: 'Activo', label: 'Cliente Activo' },
              { value: 'Potencial', label: 'Cliente Potencial' }
            ]}
          />
        </div>
      </div>

      <div className="cliente-form__section">
        <h3 className="cliente-form__section-title">
          {formData.tipoCliente === 'Empresa' ? 'Datos de la Empresa' : 'Información Personal'}
        </h3>
        
        <Input
          label={formData.tipoCliente === 'Empresa' ? 'Razón Social *' : 'Nombre *'}
          value={formData.nombre}
          onChange={(e) => handleChange('nombre', e.target.value)}
          error={errors.nombre}
          fullWidth
          placeholder={formData.tipoCliente === 'Empresa' ? 'Ej: Agrícola Los Olivos S.L.' : 'Ej: Juan'}
        />
        
        {formData.tipoCliente === 'Particular' && (
          <Input
            label="Apellidos *"
            value={formData.apellidos}
            onChange={(e) => handleChange('apellidos', e.target.value)}
            error={errors.apellidos}
            fullWidth
            placeholder="Ej: García Martínez"
          />
        )}
        
        <Input
          label={formData.tipoCliente === 'Empresa' ? 'CIF *' : 'DNI/NIE *'}
          value={formData.dni}
          onChange={(e) => handleChange('dni', e.target.value)}
          error={errors.dni}
          fullWidth
          placeholder={formData.tipoCliente === 'Empresa' ? 'Ej: B12345678' : 'Ej: 12345678A'}
        />
      </div>

      <div className="cliente-form__section">
        <h3 className="cliente-form__section-title">Información de Contacto</h3>
        
        <div className="cliente-form__row">
          <Input
            label="Teléfono *"
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
            placeholder="Ej: Sevilla"
          />
          
          <Input
            label="Código Postal"
            value={formData.codigoPostal}
            onChange={(e) => handleChange('codigoPostal', e.target.value)}
            fullWidth
            placeholder="Ej: 41001"
          />
        </div>
        
        <div className="cliente-form__row">
          <Select
            label="Provincia *"
            value={formData.provincia}
            onChange={(e) => handleChange('provincia', e.target.value)}
            error={errors.provincia}
            fullWidth
            options={[
              { value: '', label: 'Selecciona una provincia' },
              ...PROVINCIAS.map(p => ({ value: p, label: p }))
            ]}
          />
          
          <Select
            label="Comunidad Autónoma *"
            value={formData.comunidadAutonoma}
            onChange={(e) => handleChange('comunidadAutonoma', e.target.value)}
            error={errors.comunidadAutonoma}
            fullWidth
            options={[
              { value: '', label: 'Selecciona una comunidad' },
              ...COMUNIDADES_AUTONOMAS.map(ca => ({ value: ca, label: ca }))
            ]}
          />
        </div>
      </div>

      <div className="cliente-form__section">
        <h3 className="cliente-form__section-title">Asignación y Estado</h3>
        
        <div className="cliente-form__row">
          <Input
            label="Técnico Asignado"
            value={formData.tecnicoAsignado}
            onChange={(e) => handleChange('tecnicoAsignado', e.target.value)}
            fullWidth
            placeholder="Nombre del técnico"
            helperText="Deja vacío si no tiene técnico asignado"
          />
          
          <div className="cliente-form__checkbox">
            <label>
              <input
                type="checkbox"
                checked={formData.activo}
                onChange={(e) => handleChange('activo', e.target.checked)}
              />
              <span>Cliente activo</span>
            </label>
          </div>
        </div>
        
        <Textarea
          label="Notas"
          value={formData.notas}
          onChange={(e) => handleChange('notas', e.target.value)}
          fullWidth
          rows={3}
          placeholder="Observaciones adicionales sobre el cliente..."
        />
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