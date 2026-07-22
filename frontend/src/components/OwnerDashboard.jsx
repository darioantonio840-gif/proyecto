import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, TrendingUp, Calendar, CheckSquare } from 'lucide-react';
import api from '../services/api';

const OwnerDashboard = () => {
  const [cashCuts, setCashCuts] = useState([]);
  const [pendingItems, setPendingItems] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const fetchData = async () => {
    try {
      const [cutsRes, itemsRes] = await Promise.all([
        api.get('/cashcuts'),
        api.get('/restockitems')
      ]);
      setCashCuts(cutsRes.data);
      setPendingItems(itemsRes.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCompleteItem = async (id) => {
    try {
      await api.put(`/restockitems/${id}/complete`);
      // Update local state to remove item
      setPendingItems(pendingItems.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error completing item", error);
    }
  };

  // Calculate totals
  const today = new Date().toDateString();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const todayTotal = cashCuts
    .filter(c => new Date(c.date).toDateString() === today)
    .reduce((sum, cut) => sum + cut.amount, 0);

  const monthTotal = cashCuts
    .filter(c => {
      const d = new Date(c.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, cut) => sum + cut.amount, 0);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Panel de Finanzas y Compras</h1>
          <p>Vista de Dueño</p>
        </div>
        <button onClick={handleLogout} className="logout-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LogOut size={18} /> Salir
        </button>
      </div>

      <div className="stats-grid">
        <div className="glass-panel stat-card">
          <p>Corte de Hoy</p>
          <div className="stat-value" style={{ color: 'var(--primary)' }}>
            ${todayTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="glass-panel stat-card">
          <p>Acumulado del Mes</p>
          <div className="stat-value">
            ${monthTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div className="grid">
        <div className="glass-panel" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', position: 'sticky', top: '0', background: 'var(--surface)', paddingBottom: '10px' }}>
            <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '8px' }}>
              <CheckSquare size={20} color="var(--secondary)" />
            </div>
            <h2>Por Surtir (Pendientes)</h2>
          </div>
          
          {pendingItems.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '20px' }}>No hay pendientes de comprar. ¡Todo está surtido!</p>
          ) : (
            <div>
              {pendingItems.map(item => (
                <div key={item.id} className="list-item">
                  <div>
                    <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '4px' }}>
                      {item.productName}
                    </strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Reportado por {item.reportedBy} - {new Date(item.reportedAt).toLocaleDateString()} {new Date(item.reportedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <input 
                    type="checkbox" 
                    className="checkbox-custom"
                    title="Marcar como comprado"
                    onChange={() => handleCompleteItem(item.id)} 
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-panel" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', position: 'sticky', top: '0', background: 'var(--surface)', paddingBottom: '10px' }}>
            <div style={{ padding: '8px', background: 'rgba(79, 70, 229, 0.2)', borderRadius: '8px' }}>
              <TrendingUp size={20} color="var(--primary)" />
            </div>
            <h2>Historial de Cortes</h2>
          </div>
          
          {cashCuts.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '20px' }}>Aún no hay cortes de caja registrados.</p>
          ) : (
            <div>
              {cashCuts.map(cut => (
                <div key={cut.id} className="list-item">
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      {new Date(cut.date).toLocaleDateString()}
                    </span>
                    <strong style={{ fontSize: '1.1rem' }}>{cut.employeeName}</strong>
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                    ${cut.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
