import React from 'react';
import { createRoot } from 'react-dom/client';
import { CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';

// Persistent references
let alertRoot = null;
let alerts = [];
let rootInstance = null;

const AlertComponent = ({ type, message, onClose }) => {
  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-l-4 border-green-400',
      text: 'text-green-800',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-l-4 border-red-400',
      text: 'text-red-800',
      icon: <XCircle className="w-5 h-5 text-red-500" />
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-l-4 border-yellow-400',
      text: 'text-yellow-800',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />
    }
  };

  const { bg, border, text, icon } = styles[type] || styles.error;

  return (
    <div className={`${bg} ${border} ${text} p-4 mb-3 rounded-lg shadow-lg flex items-start`}>
      <div className="mr-3">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="ml-2 text-gray-500 hover:text-gray-700"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const renderAlerts = () => {
  if (!rootInstance) return;
  
  rootInstance.render(
    <div className="fixed top-4 right-4 z-50 w-80 space-y-2">
      {alerts.map(alert => (
        <AlertComponent
          key={alert.id}
          type={alert.type}
          message={alert.message}
          onClose={() => removeAlert(alert.id)}
        />
      ))}
    </div>
  );
};

const removeAlert = (id) => {
  alerts = alerts.filter(alert => alert.id !== id);
  renderAlerts();
};

const showAlert = (type, message, duration = 3000) => {
  // Initialize on first call
  if (!alertRoot) {
    const container = document.createElement('div');
    container.id = 'alert-container';
    document.body.appendChild(container);
    alertRoot = container;
    rootInstance = createRoot(container);
  }

  const alertId = Date.now();
  alerts = [...alerts, { id: alertId, type, message }];
  renderAlerts();

  if (duration > 0) {
    setTimeout(() => removeAlert(alertId), duration);
  }
};

// Public API
export const alert = {
  success: (msg, duration) => showAlert('success', msg, duration),
  error: (msg, duration) => showAlert('error', msg, duration),
  warning: (msg, duration) => showAlert('warning', msg, duration),
  clearAll: () => {
    alerts = [];
    renderAlerts();
  }
};