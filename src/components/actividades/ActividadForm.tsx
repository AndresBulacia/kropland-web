import React, { useState } from 'react';
import type { Actividad, TipoActividad } from '../../types';
import { Input, Select, Textarea } from '../common/Input';
import { Button } from '../common/Button';
import { useActividades } from '../../hooks/useActividades';
import './ActividadForm.css';

interface ActividadFormProps {
  actividad?: Actividad;
  fincaId: string;
  superficieFinca: number;
  onSubmit: () => void;
  onCancel: () => void;
}

const tiposActividad: TipoActividad[] = [
  'Poda',
  'Pulverización',
  'Herbicida',
  'Recolección',
  'Abonado',
  'Riego',
  'Análisis',
  'Siembra',
  'Otro'
];

export const ActividadForm: React.FC<ActividadFormProps> = ({
  actividad,
  fincaId,
  superficieFinca,
  onSubmit,
  onCancel
}) => {
  const { crearActividad, actualizarActividad } = useActividades();
  
  const [formData, setFormData] = useState({
    tipo: actividad?.tipo || 'Poda' as TipoActividad,
    descripcion: actividad?.descripcion || '',
    fecha: actividad?.fecha || new Date().toISOString().split('T')[0],
    costoTotal: actividad?.costoTotal?.toString() || '',
    responsable: actividad?.responsable || '',
    notas: actividad?.notas || '',
    estado: actividad?.estado || 'Planificada' as Actividad['estado']
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const costoPorHa = formData.costoTotal && superficieFinca > 0
    ? (parseFloat(formData.costoTotal) / superficieFinca).toFixed(2)
    : '0.00';

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

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    }
    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es obligatoria';
    }
    if (!formData.costoTotal || parseFloat(formData.costoTotal) < 0) {
      newErrors.costoTotal = 'El costo debe ser mayor o igual a 0';
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

    const actividadData = {
      fincaId,
      tipo: formData.tipo,
      descripcion: formData.descripcion,
      fecha: formData.fecha,
      costoTotal: parseFloat(formData.costoTotal),
      responsable: formData.responsable || undefined,
      notas: formData.notas || undefined,
      estado: formData.estado,
      productos: []
    };

    setTimeout(() => {
      if (actividad) {
        actualizarActividad(actividad.id, actividadData);
      } else {
        crearActividad(actividadData, superficieFinca);
      }
      setLoading(false);
      onSubmit();
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="actividad-form">
      <div className="actividad-form__section">
        <h3 className="actividad-form__section-title">Información de la Actividad</h3>
        
        <div className="actividad-form__row">
          <Select
            label="Tipo de Actividad *"
            value={formData.tipo}
            onChange={(e) => handleChange('tipo', e.target.value)}
            fullWidth
            options={tiposActividad.map(t => ({ value: t, label: t }))}
          />
          
          <Input
            label="Fecha *"
            type="date"
            value={formData.fecha}
            onChange={(e) => handleChange('fecha', e.target.value)}
            error={errors.fecha}
            fullWidth
          />
        </div>

        <Textarea
          label="Descripción *"
          value={formData.descripcion}
          onChange={(e) => handleChange('descripcion', e.target.value)}
          error={errors.descripcion}
          fullWidth
          rows={3}
          placeholder="Describe la actividad realizada..."
        />
      </div>

      <div className="actividad-form__section">
        <h3 className="actividad-form__section-title">Costos</h3>
        
        <div className="actividad-form__row">
          <Input
            label="Costo Total (€) *"
            type="number"
            step="0.01"
            value={formData.costoTotal}
            onChange={(e) => handleChange('costoTotal', e.target.value)}
            error={errors.costoTotal}
            fullWidth
            placeholder="0.00"
          />
          
          <div className="actividad-form__calculated">
            <label>Costo por Hectárea</label>
            <div className="actividad-form__calculated-value">
              {costoPorHa} €/ha
            </div>
            <span className="actividad-form__calculated-help">
              Calculado automáticamente según superficie de {superficieFinca} ha
            </span>
          </div>
        </div>
      </div>

      <div className="actividad-form__section">
        <h3 className="actividad-form__section-title">Detalles Adicionales</h3>
        
        <div className="actividad-form__row">
          <Input
            label="Responsable"
            value={formData.responsable}
            onChange={(e) => handleChange('responsable', e.target.value)}
            fullWidth
            placeholder="Nombre del responsable"
          />
          
          <Select
            label="Estado *"
            value={formData.estado}
            onChange={(e) => handleChange('estado', e.target.value)}
            fullWidth
            options={[
              { value: 'Planificada', label: 'Planificada' },
              { value: 'En Proceso', label: 'En Proceso' },
              { value: 'Completada', label: 'Completada' },
              { value: 'Cancelada', label: 'Cancelada' }
            ]}
          />
        </div>

        <Textarea
          label="Notas"
          value={formData.notas}
          onChange={(e) => handleChange('notas', e.target.value)}
          fullWidth
          rows={3}
          placeholder="Observaciones adicionales..."
        />
      </div>

      <div className="actividad-form__actions">
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
          {actividad ? 'Actualizar' : 'Crear'} Actividad
        </Button>
      </div>
    </form>
  );
};