import React from 'react';
import './ActivityList.css';

interface Activity {
  id: string;
  type: 'visita' | 'actividad' | 'cliente' | 'alerta';
  title: string;
  description: string;
  time: string;
  user?: string;
}

interface ActivityListProps {
  activities: Activity[];
  title?: string;
  emptyMessage?: string;
}

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'visita':
      return (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      );
    case 'actividad':
      return (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case 'cliente':
      return (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    case 'alerta':
      return (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
  }
};

const getActivityColor = (type: Activity['type']) => {
  switch (type) {
    case 'visita':
      return 'primary';
    case 'actividad':
      return 'secondary';
    case 'cliente':
      return 'success';
    case 'alerta':
      return 'warning';
    default:
      return 'primary';
  }
};

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Ahora mismo';
  if (minutes < 60) return `Hace ${minutes} min`;
  if (hours < 24) return `Hace ${hours}h`;
  if (days < 7) return `Hace ${days}d`;
  
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};

export const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  title = 'Actividad Reciente',
  emptyMessage = 'No hay actividad reciente'
}) => {
  return (
    <div className="activity-list">
      <h3 className="activity-list__title">{title}</h3>
      
      {activities.length === 0 ? (
        <div className="activity-list__empty">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="activity-list__items">
          {activities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className={`activity-item__icon activity-item__icon--${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="activity-item__content">
                <div className="activity-item__header">
                  <h4 className="activity-item__title">{activity.title}</h4>
                  <span className="activity-item__time">
                    {formatTimeAgo(activity.time)}
                  </span>
                </div>
                <p className="activity-item__description">{activity.description}</p>
                {activity.user && (
                  <span className="activity-item__user">por {activity.user}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};