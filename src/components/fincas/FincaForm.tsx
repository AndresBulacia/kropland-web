import React, { useState } from 'react';
import type { Finca, TipoRiego } from '../../types';
import { Input, Select, Textarea } from '../common/Input';
import { Button } from '../common/Button';
import './FincaForm.css';

interface FincaFormProps {
  finca?: Finca;
  clienteId: string;
  onSubmit: (data: Omit<Finca, 'id' | 'fechaCreacion'>) => void;
  onCancel: () => void;
}

const cultivosDisponibles = [
  'Olivo',
  'Viña',
  'Almendro',
  'Pistacho',
  'Cítricos',
  'Cereal',
  'Hortícola',
  'Otro'
];

const tiposRiego = [
  'Secano',
  'Regadío',
  'Goteo',
  'Aspersión'
]

const tecnicosDisponibles = [
  'Raquel Romero Peces',
  'Juan Jose Vilar Llido',
  'Javier Lengua Alvaro',
  'Daniel Gonzalez Romera'
]

export const FincaForm: React.FC<FincaFormProps> = ({
  finca,
  clienteId,
  onSubmit,
  onCancel
}) => {
  
  const [formData, setFormData] = useState({
    nombre: finca?.nombre || '',
    cultivo: finca?.cultivo || 'Olivo',
    variedad: finca?.variedad || '',
    portainjerto: finca?.portainjerto || '',
    superficie: finca?.superficie?.toString() || '',
    volumenCaldoPorHa: finca?.volumenCaldoPorHa?.toString() || '',
    añoPlantacion: finca?.añoPlantacion?.toString() || '',
    tipoRiego: finca?.tipoRiego || 'Secano',
    direccion: finca?.ubicacion?.direccion || '',
    latitud: finca?.ubicacion?.latitud?.toString() || '',
    longitud: finca?.ubicacion?.longitud?.toString() || '',
    notas: finca?.notas || '',
    tecnicoAsignado: finca?.tecnicoAsignado || '',
    activa: finca?.activa ?? true
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

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    if (!formData.superficie || parseFloat(formData.superficie) <= 0) {
      newErrors.superficie = 'La superficie debe ser mayor a 0';
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

    const fincaData = {
      clienteId,
      nombre: formData.nombre,
      cultivo: formData.cultivo,
      variedad: formData.variedad || undefined,
      portainjerto: formData.portainjerto || undefined,
      superficie: parseFloat(formData.superficie),
      volumenCaldoPorHa: formData.volumenCaldoPorHa ? parseFloat(formData.volumenCaldoPorHa) : undefined,
      añoPlantacion: formData.añoPlantacion ? parseInt(formData.añoPlantacion) : undefined,
      tipoRiego: formData.tipoRiego as Finca[TipoRiego],
      ubicacion: (formData.direccion || formData.latitud || formData.longitud) ? {
        direccion: formData.direccion || undefined,
        latitud: formData.latitud ? parseFloat(formData.latitud) : undefined,
        longitud: formData.longitud ? parseFloat(formData.longitud) : undefined,
      } : undefined,
      notas: formData.notas || undefined,
      tecnicoAsignado: formData.tecnicoAsignado || undefined,
      activa: formData.activa
    };

    setTimeout(() => {
      onSubmit(fincaData);
      setLoading(false);
    }, 500);
      
  };

  return (
    <form onSubmit={handleSubmit} className="finca-form">
      <div className="finca-form__section">
        <h3 className="finca-form__section-title">Información Básica</h3>
        
        <div className="finca-form__row">
          <Input
            label="Nombre de la Finca *"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            error={errors.nombre}
            fullWidth
            placeholder="Ej: El Olivar"
          />
        </div>

        <div className="finca-form__row">
          <Select
            label="Cultivo *"
            value={formData.cultivo}
            onChange={(e) => handleChange('cultivo', e.target.value)}
            fullWidth
            options={cultivosDisponibles.map(c => ({value: c, label: c}))}
          />
          
          <Input
            label="Variedad"
            value={formData.variedad}
            onChange={(e) => handleChange('variedad', e.target.value)}
            error={errors.variedad}
            fullWidth
            placeholder="Ej: Picual, Tempranillo, Guara..."
          />
        </div>

          <Input
            label="Portainjerto"
            value={formData.portainjerto}
            onChange={(e) => handleChange('portainjerto', e.target.value)}
            fullWidth
            placeholder="Opcional"
          />
      </div>

      <div className="finca-form__section">
        <h3 className="finca-form__section-title">Características de la Finca</h3>
        
        <div className="finca-form__row">
          <Input
            label="Superficie (ha) *"
            type="number"
            step="0.01"
            value={formData.superficie}
            onChange={(e) => handleChange('superficie', e.target.value)}
            error={errors.superficie}
            fullWidth
            placeholder="Ej: 12.5"
          />
          
          <Input
            label="Volumen de Caldo (L/ha)"
            type="number"
            step="1"
            value={formData.volumenCaldoPorHa}
            onChange={(e) => handleChange('volumenCaldoPorHa', e.target.value)}
            fullWidth
            placeholder="Ej: 800"
          />
        </div>

        <div className="finca-form__row">
          <Input
            label="Año de Plantación"
            type="number"
            value={formData.añoPlantacion}
            onChange={(e) => handleChange('añoPlantacion', e.target.value)}
            fullWidth
            placeholder="Ej: 2015"
            min="1900"
            max={new Date().getFullYear()}
          />
          
          <Select
            label="Tipo de Riego *"
            value={formData.tipoRiego}
            onChange={(e) => handleChange('tipoRiego', e.target.value)}
            fullWidth
            options={tiposRiego.map(r => ({value: r, label: r}))}
          />
        </div>
      </div>

      <div className="finca-form__section">
        <h3 className="finca-form__section-title">Ubicación</h3>
        
        <Input
          label="Dirección"
          value={formData.direccion}
          onChange={(e) => handleChange('direccion', e.target.value)}
          fullWidth
          placeholder="Ej: Paraje Los Olivos, s/n"
        />
        
        <div className="finca-form__row">
          <Input
            label="Latitud"
            type="number"
            step="0.000001"
            value={formData.latitud}
            onChange={(e) => handleChange('latitud', e.target.value)}
            fullWidth
            placeholder="Ej: 38.9848"
          />
          
          <Input
            label="Longitud"
            type="number"
            step="0.000001"
            value={formData.longitud}
            onChange={(e) => handleChange('longitud', e.target.value)}
            fullWidth
            placeholder="Ej: -3.9271"
          />
        </div>

        <div className="finca-form__help">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Las coordenadas GPS permiten visualizar la finca en el mapa</span>
        </div>
      </div>

      <div className="finca-form__section">
        <h3 className="finca-form__section-title">Información Adicional</h3>

        <div className="finca-form__row">
          <Select
            label="Técnico Asignado"
            value={formData.tecnicoAsignado}
            onChange={(e) => handleChange('tecnicoAsignado', e.target.value)}
            fullWidth
            options={tecnicosDisponibles.map(t => ({value: t, label: t}))}
          />
        </div>
        
        <div className="finca-form__checkbox">
          <input
            type="checkbox"
            id="activa"
            checked={formData.activa}
            onChange={(e) => handleChange('activa', e.target.checked)}
          />
          <label htmlFor="activa">Finca activa</label>
        </div>

        <Textarea
          label="Notas"
          value={formData.notas}
          onChange={(e) => handleChange('notas', e.target.value)}
          fullWidth
          rows={4}
          placeholder="Observaciones, certificaciones, características especiales..."
        />

      </div>

      <div className="finca-form__actions">
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
          {finca ? 'Actualizar' : 'Crear'} Finca
        </Button>
      </div>
    </form>
  );
};