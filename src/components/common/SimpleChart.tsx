import React from 'react';
import './SimpleChart.css';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface SimpleChartProps {
  data: ChartData[];
  title?: string;
  height?: number;
}

export const SimpleChart: React.FC<SimpleChartProps> = ({
  data,
  title,
  height = 300
}) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  return (
    <div className="simple-chart">
      {title && <h3 className="simple-chart__title">{title}</h3>}
      
      <div className="simple-chart__container" style={{ height: `${height}px` }}>
        <div className="simple-chart__bars">
          {data.map((item, index) => {
            const percentage = (item.value / maxValue) * 100;
            const color = item.color || 'var(--color-secondary)';
            
            return (
              <div key={index} className="simple-chart__bar-wrapper">
                <div 
                  className="simple-chart__bar"
                  style={{ 
                    height: `${percentage}%`,
                    backgroundColor: color
                  }}
                  title={`${item.label}: ${item.value}`}
                >
                  <span className="simple-chart__value">{item.value}</span>
                </div>
                <span className="simple-chart__label">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Componente de gráfico circular simple
interface PieChartProps {
  data: ChartData[];
  title?: string;
}

export const SimplePieChart: React.FC<PieChartProps> = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="simple-pie-chart">
      {title && <h3 className="simple-chart__title">{title}</h3>}
      
      <div className="simple-pie-chart__container">
        <div className="simple-pie-chart__legend">
          {data.map((item, index) => {
            const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
            const color = item.color || `hsl(${(index * 360) / data.length}, 70%, 50%)`;
            
            return (
              <div key={index} className="simple-pie-chart__legend-item">
                <span 
                  className="simple-pie-chart__legend-color"
                  style={{ backgroundColor: color }}
                />
                <span className="simple-pie-chart__legend-label">
                  {item.label}
                </span>
                <span className="simple-pie-chart__legend-value">
                  {item.value} ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};