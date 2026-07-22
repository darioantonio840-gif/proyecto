import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, UserPlus, Trash2, Edit } from 'lucide-react';
import api from '../services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  
  // Form state
  const [editingUserId, setEditingUserId] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Employee');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateOrUpdateUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || (!password && !editingUserId)) {
      setError('Por favor llena los campos requeridos.');
      return;
    }

    try {
      if (editingUserId) {
        // Edit mode
        await api.put(`/users/${editingUserId}`, { username, password, role });
        setSuccess('Usuario actualizado exitosamente.');
      } else {
        // Create mode
        await api.post('/users', { username, password, role });
        setSuccess('Usuario creado exitosamente.');
      }
      
      resetForm();
      fetchUsers(); // Refresh the list
    } catch (err) {
      setError(err.response?.data || 'Error al procesar la solicitud.');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;
    
    try {
      await api.delete(`/users/${id}`);
      setSuccess('Usuario eliminado.');
      fetchUsers();
    } catch (err) {
      setError(err.response?.data || 'Error al eliminar usuario.');
    }
  };

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setUsername(user.username);
    setPassword(''); // Leave empty, only update if typed
    setRole(user.role);
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingUserId(null);
    setUsername('');
    setPassword('');
    setRole('Employee');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Panel de Administración</h1>
          <p>Gestión de usuarios y roles del sistema</p>
        </div>
        <button onClick={handleLogout} className="logout-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LogOut size={18} /> Salir
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '24px', color: '#FCA5A5' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--secondary)', padding: '12px', borderRadius: '8px', marginBottom: '24px', color: '#6EE7B7' }}>
          {success}
        </div>
      )}

      <div className="grid">
        <div className="glass-panel" style={{ height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '10px', background: 'rgba(79, 70, 229, 0.2)', borderRadius: '10px' }}>
                {editingUserId ? <Edit size={24} color="var(--primary)" /> : <UserPlus size={24} color="var(--primary)" />}
              </div>
              <h2>{editingUserId ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
            </div>
            {editingUserId && (
              <button onClick={resetForm} className="btn-secondary" style={{ padding: '6px 12px', width: 'auto', fontSize: '0.85rem' }}>
                Cancelar Edición
              </button>
            )}
          </div>
          
          <form onSubmit={handleCreateOrUpdateUser}>
            <div className="input-group">
              <label>Nombre de Usuario</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ej. juan.perez"
                required 
              />
            </div>
            <div className="input-group">
              <label>Contraseña {editingUserId && '(Opcional: déjalo en blanco para no cambiarla)'}</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={editingUserId ? "Dejar en blanco para mantener actual" : "••••••••"}
                required={!editingUserId} 
              />
            </div>
            <div className="input-group">
              <label>Rol del Sistema</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: 'var(--text-main)',
                  fontSize: '1rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="Employee">Empleado (Reporta e ingresa caja)</option>
                <option value="Owner">Dueño (Ve finanzas y compras)</option>
                <option value="Admin">Administrador (Gestiona usuarios)</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
              {editingUserId ? 'Guardar Cambios' : 'Crear Usuario'}
            </button>
          </form>
        </div>

        <div className="glass-panel" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', position: 'sticky', top: '0', background: 'var(--surface)', paddingBottom: '10px', zIndex: 1 }}>
            <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '10px' }}>
              <Users size={24} color="var(--secondary)" />
            </div>
            <h2>Usuarios Registrados</h2>
          </div>
          
          {users.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '20px' }}>Cargando usuarios...</p>
          ) : (
            <div>
              {users.map(user => (
                <div key={user.id} className="list-item" style={{ padding: '12px 16px' }}>
                  <div>
                    <strong style={{ fontSize: '1.1rem', display: 'block', marginBottom: '4px' }}>
                      {user.username}
                    </strong>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      padding: '2px 8px', 
                      borderRadius: '12px',
                      background: user.role === 'Admin' ? 'rgba(239, 68, 68, 0.2)' : user.role === 'Owner' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(79, 70, 229, 0.2)',
                      color: user.role === 'Admin' ? '#FCA5A5' : user.role === 'Owner' ? '#6EE7B7' : '#A5B4FC'
                    }}>
                      {user.role}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => handleEditClick(user)}
                      style={{ 
                        background: 'rgba(79, 70, 229, 0.2)', 
                        border: '1px solid var(--primary)', 
                        borderRadius: '6px',
                        padding: '6px',
                        cursor: 'pointer',
                        color: 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Editar usuario"
                    >
                      <Edit size={16} />
                    </button>
                    {user.role !== 'Admin' && (
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        style={{ 
                          background: 'rgba(239, 68, 68, 0.2)', 
                          border: '1px solid var(--danger)', 
                          borderRadius: '6px',
                          padding: '6px',
                          cursor: 'pointer',
                          color: 'var(--text-main)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Eliminar usuario"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
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

export default AdminDashboard;
