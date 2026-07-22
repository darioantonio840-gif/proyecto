import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, DollarSign, ShoppingCart, CheckCircle } from 'lucide-react';
import api from '../services/api';

const EmployeeDashboard = () => {
  const [cashAmount, setCashAmount] = useState('');
  const [productName, setProductName] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleSendCashCut = async (e) => {
    e.preventDefault();
    if (!cashAmount || isNaN(cashAmount)) return;

    try {
      await api.post('/cashcuts', { amount: parseFloat(cashAmount) });
      setCashAmount('');
      showMessage('Corte de caja enviado exitosamente');
    } catch (error) {
      showMessage('Error al enviar corte de caja', 'error');
    }
  };

  const handleReportMissingItem = async (e) => {
    e.preventDefault();
    if (!productName.trim()) return;

    try {
      await api.post('/restockitems', { productName });
      setProductName('');
      showMessage('Producto reportado exitosamente');
    } catch (error) {
      showMessage('Error al reportar producto', 'error');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Panel de Empleado</h1>
          <p>Hola, {localStorage.getItem('username')} 👋</p>
        </div>
        <button onClick={handleLogout} className="logout-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LogOut size={18} /> Salir
        </button>
      </div>

      {message.text && (
        <div style={{ 
          background: message.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)', 
          border: `1px solid ${message.type === 'error' ? 'var(--danger)' : 'var(--secondary)'}`, 
          padding: '12px', 
          borderRadius: '8px', 
          marginBottom: '24px',
          color: message.type === 'error' ? '#FCA5A5' : '#6EE7B7',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle size={20} /> {message.text}
        </div>
      )}

      <div className="grid">
        <div className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ padding: '10px', background: 'rgba(79, 70, 229, 0.2)', borderRadius: '10px' }}>
              <DollarSign size={24} color="var(--primary)" />
            </div>
            <h2>Enviar Corte de Caja</h2>
          </div>
          <p style={{ marginBottom: '20px' }}>Ingresa el dinero total del día.</p>
          
          <form onSubmit={handleSendCashCut}>
            <div className="input-group">
              <label>Monto Total ($)</label>
              <input 
                type="number" 
                step="0.01" 
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
                placeholder="ej. 3500.00"
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Enviar Corte
            </button>
          </form>
        </div>

        <div className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '10px' }}>
              <ShoppingCart size={24} color="var(--secondary)" />
            </div>
            <h2>Reportar Faltantes</h2>
          </div>
          <p style={{ marginBottom: '20px' }}>Agrega productos o insumos que se hayan agotado (Por surtir).</p>
          
          <form onSubmit={handleReportMissingItem}>
            <div className="input-group">
              <label>Nombre del Producto</label>
              <input 
                type="text" 
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="ej. Bolsas chicas, Coca-Cola 600ml"
                required 
              />
            </div>
            <button type="submit" className="btn btn-secondary">
              Agregar a la lista
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
