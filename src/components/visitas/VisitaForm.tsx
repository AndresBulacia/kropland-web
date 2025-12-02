import React, { useState } from 'react';
import type { Visita, ProductoAplicado, TipoProducto } from '../../types';
import { Input, Select, Textarea } from '../common/Input';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import './VisitaForm.css';

interface VisitaFormCompletoProps {
  visita?: Visita;
  clienteId?: string;
  fincaId?: string;
  onSubmit: (data: Omit<Visita, 'id' | 'fechaCreacion'>) => void;
  onCancel: () => void;
  clientes: Array<{ id: string; nombre: string; apellidos?: string }>;
  fincas: Array<{ id: string; clienteId: string; nombre: string }>;
}

const actividadesDisponibles = [
  'Inspección',
  'Poda',
  'Riego',
  'Pulverización',
  'Tratamiento',
  'Fertilización',
  'Recolección',
  'Análisis',
  'Mantenimiento',
  'Otro'
];

const tiposProducto: TipoProducto[] = [
  'Fitosanitario',
  'Herbicida',
  'Abono',
  'Nutricional',
  'Otro'
];

export const VisitaFormCompleto: React.FC<VisitaFormCompletoProps> = ({
  visita,
  clienteId: clienteIdProp,
  fincaId: fincaIdProp,
  onSubmit,
  onCancel,
  clientes,
  fincas
}) => {
  const [formData, setFormData] = useState({
    clienteId: visita?.clienteId || clienteIdProp || '',
    fincaId: visita?.fincaId || fincaIdProp || '',
    fecha: visita?.fecha ? visita.fecha.split('T')[0] : new Date().toISOString().split('T')[0],
    duracionMinutos: visita?.duracionMinutos?.toString() || '60',
    tecnicoId: visita?.tecnicoId || '',
    estado: visita?.estado || 'Pendiente' as Visita['estado'],
    
    // Nuevos campos
    observaciones: visita?.observaciones || '',
    actividadesRealizadas: visita?.actividadesRealizadas || [],
    climaObservado: visita?.climaObservado || '',
    estadoCultivo: visita?.estadoCultivo || '',
    plagasDetectadas: visita?.plagasDetectadas || '',
    recomendaciones: visita?.recomendaciones || '',
    proximaVisita: visita?.proximaVisita || '',
  });

  const [productos, setProductos] = useState<ProductoAplicado[]>(
    visita?.productosAplicados || []
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Filtrar fincas según cliente seleccionado
  const fincasCliente = fincas.filter(f => f.clienteId === formData.clienteId);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Si cambia el cliente, resetear la finca
      if (field === 'clienteId') {
        newData.fincaId = '';
      }
      
      return newData;
    });
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const toggleActividad = (actividad: string) => {
    setFormData(prev => ({
      ...prev,
      actividadesRealizadas: prev.actividadesRealizadas.includes(actividad)
        ? prev.actividadesRealizadas.filter(a => a !== actividad)
        : [...prev.actividadesRealizadas, actividad]
    }));
  };

  const agregarProducto = () => {
    setProductos(prev => [...prev, {
      tipo: 'Fitosanitario' as TipoProducto,
      nombre: '',
      dosis: '',
      unidad: 'L/ha'
    }]);
  };

  const eliminarProducto = (index: number) => {
    setProductos(prev => prev.filter((_, i) => i !== index));
  };

  const actualizarProducto = (index: number, field: string, value: string) => {
    setProductos(prev => prev.map((p, i) => 
      i === index ? { ...p, [field]: value } : p
    ));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.clienteId) {
      newErrors.clienteId = 'El cliente es obligatorio';
    }
    
    if (!formData.fincaId) {
      newErrors.fincaId = 'La finca es obligatoria';
    }
    
    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es obligatoria';
    }
    
    if (!formData.tecnicoId) {
      newErrors.tecnicoId = 'El técnico es obligatorio';
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

    const visitaData = {
      clienteId: formData.clienteId,
      fincaId: formData.fincaId,
      fecha: new Date(formData.fecha).toISOString(),
      duracionMinutos: parseInt(formData.duracionMinutos) || undefined,
      tecnicoId: formData.tecnicoId,
      estado: formData.estado,
      observaciones: formData.observaciones || undefined,
      actividadesRealizadas: formData.actividadesRealizadas.length > 0 ? formData.actividadesRealizadas : undefined,
      climaObservado: formData.climaObservado || undefined,
      estadoCultivo: formData.estadoCultivo || undefined,
      plagasDetectadas: formData.plagasDetectadas || undefined,
      recomendaciones: formData.recomendaciones || undefined,
      proximaVisita: formData.proximaVisita || undefined,
      productosAplicados: productos.length > 0 ? productos : undefined,
    };

    setTimeout(() => {
      onSubmit(visitaData);
      setLoading(false);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="visita-form-completo">
      {/* Sección 1: Información Básica */}
      <div className="visita-form__section">
        <h3 className="visita-form__section-title">Información Básica</h3>
        
        <div className="visita-form__row">
          <Select
            label="Cliente *"
            value={formData.clienteId}
            onChange={(e) => handleChange('clienteId', e.target.value)}
            error={errors.clienteId}
            fullWidth
            disabled={!!clienteIdProp}
            options={[
              { value: '', label: 'Selecciona un cliente' },
              ...clientes.map(c => ({
                value: c.id,
                label: c.apellidos ? `${c.nombre} ${c.apellidos}` : c.nombre
              }))
            ]}
          />
          
          <Select
            label="Finca *"
            value={formData.fincaId}
            onChange={(e) => handleChange('fincaId', e.target.value)}
            error={errors.fincaId}
            fullWidth
            disabled={!!fincaIdProp || !formData.clienteId}
            options={[
              { value: '', label: formData.clienteId ? 'Selecciona una finca' : 'Primero selecciona un cliente' },
              ...fincasCliente.map(f => ({
                value: f.id,
                label: f.nombre
              }))
            ]}
          />
        </div>
        
        <div className="visita-form__row">
          <Input
            label="Fecha *"
            type="date"
            value={formData.fecha}
            onChange={(e) => handleChange('fecha', e.target.value)}
            error={errors.fecha}
            fullWidth
          />
          
          <Input
            label="Duración (minutos)"
            type="number"
            value={formData.duracionMinutos}
            onChange={(e) => handleChange('duracionMinutos', e.target.value)}
            fullWidth
            placeholder="60"
            helperText="La hora exacta se registra automáticamente"
          />
        </div>
        
        <div className="visita-form__row">
          <Input
            label="Técnico Responsable *"
            value={formData.tecnicoId}
            onChange={(e) => handleChange('tecnicoId', e.target.value)}
            error={errors.tecnicoId}
            fullWidth
            placeholder="Nombre del técnico"
          />
          
          <Select
            label="Estado *"
            value={formData.estado}
            onChange={(e) => handleChange('estado', e.target.value)}
            fullWidth
            options={[
              { value: 'Pendiente', label: 'Pendiente' },
              { value: 'Confirmada', label: 'Confirmada' },
              { value: 'Realizada', label: 'Realizada' },
              { value: 'Cancelada', label: 'Cancelada' }
            ]}
          />
        </div>
      </div>

      {/* Sección 2: Actividades Realizadas */}
      <div className="visita-form__section">
        <h3 className="visita-form__section-title">Actividades Realizadas</h3>
        <p className="visita-form__helper-text">
          Selecciona todas las actividades que se realizaron o planean realizar en esta visita
        </p>
        
        <div className="visita-form__actividades">
          {actividadesDisponibles.map(actividad => (
            <button
              key={actividad}
              type="button"
              className={`actividad-chip ${formData.actividadesRealizadas.includes(actividad) ? 'active' : ''}`}
              onClick={() => toggleActividad(actividad)}
            >
              {formData.actividadesRealizadas.includes(actividad) && (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {actividad}
            </button>
          ))}
        </div>
      </div>

      {/* Sección 3: Observaciones de Campo */}
      <div className="visita-form__section">
        <h3 className="visita-form__section-title">Observaciones de Campo</h3>
        
        <Textarea
          label="Observaciones Generales"
          value={formData.observaciones}
          onChange={(e) => handleChange('observaciones', e.target.value)}
          fullWidth
          rows={4}
          placeholder="Describe detalladamente todo lo observado durante la visita..."
        />
        
        <div className="visita-form__row">
          <Input
            label="Clima Observado"
            value={formData.climaObservado}
            onChange={(e) => handleChange('climaObservado', e.target.value)}
            fullWidth
            placeholder="Ej: Soleado, 22°C, sin viento"
          />
          
          <Input
            label="Estado del Cultivo"
            value={formData.estadoCultivo}
            onChange={(e) => handleChange('estadoCultivo', e.target.value)}
            fullWidth
            placeholder="Ej: Buen desarrollo vegetativo"
          />
        </div>
        
        <Textarea
          label="Plagas o Enfermedades Detectadas"
          value={formData.plagasDetectadas}
          onChange={(e) => handleChange('plagasDetectadas', e.target.value)}
          fullWidth
          rows={3}
          placeholder="Describe cualquier plaga, enfermedad o problema detectado..."
        />
        
        <Textarea
          label="Recomendaciones para el Cliente"
          value={formData.recomendaciones}
          onChange={(e) => handleChange('recomendaciones', e.target.value)}
          fullWidth
          rows={3}
          placeholder="Recomendaciones técnicas, acciones a seguir, etc..."
        />
        
        <Input
          label="Próxima Visita Sugerida"
          type="date"
          value={formData.proximaVisita}
          onChange={(e) => handleChange('proximaVisita', e.target.value)}
          fullWidth
        />
      </div>

      {/* Sección 4: Productos Aplicados */}
      <div className="visita-form__section">
        <div className="visita-form__section-header">
          <div>
            <h3 className="visita-form__section-title">Productos Aplicados</h3>
            <p className="visita-form__helper-text">
              Registra los productos fitosanitarios, herbicidas o abonos aplicados
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={agregarProducto}
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          >
            Añadir Producto
          </Button>
        </div>
        
        {productos.length > 0 ? (
          <div className="visita-form__productos">
            {productos.map((producto, index) => (
              <div key={index} className="producto-item">
                <div className="producto-item__header">
                  <Badge variant="info" size="sm">Producto {index + 1}</Badge>
                  <button
                    type="button"
                    className="producto-item__delete"
                    onClick={() => eliminarProducto(index)}
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="producto-item__fields">
                  <Select
                    label="Tipo"
                    value={producto.tipo}
                    onChange={(e) => actualizarProducto(index, 'tipo', e.target.value)}
                    fullWidth
                    options={tiposProducto.map(t => ({ value: t, label: t }))}
                  />
                  
                  <Input
                    label="Nombre del Producto"
                    value={producto.nombre}
                    onChange={(e) => actualizarProducto(index, 'nombre', e.target.value)}
                    fullWidth
                    placeholder="Ej: Lambda Cihalotrin 2.5%"
                  />
                  
                  <Input
                    label="Dosis"
                    value={producto.dosis}
                    onChange={(e) => actualizarProducto(index, 'dosis', e.target.value)}
                    fullWidth
                    placeholder="0.3"
                  />
                  
                  <Select
                    label="Unidad"
                    value={producto.unidad}
                    onChange={(e) => actualizarProducto(index, 'unidad', e.target.value)}
                    fullWidth
                    options={[
                      { value: 'L/ha', label: 'L/ha' },
                      { value: 'kg/ha', label: 'kg/ha' },
                      { value: 'g/ha', label: 'g/ha' },
                      { value: 'ml/ha', label: 'ml/ha' },
                      { value: 'cc/ha', label: 'cc/ha' }
                    ]}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="visita-form__empty">
            <p>No se han registrado productos aplicados</p>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="visita-form__actions">
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
          {visita ? 'Actualizar' : 'Registrar'} Visita
        </Button>
      </div>
    </form>
  );
};