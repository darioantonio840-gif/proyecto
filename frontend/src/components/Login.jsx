import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import api from '../services/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setErrorDetails('');

    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, role, userId } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', username);
      localStorage.setItem('userId', userId);

      if (role === 'Admin') {
        navigate('/admin');
      } else if (role === 'Owner') {
        navigate('/owner');
      } else {
        navigate('/employee');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        // Server responded with non-2xx code
        const serverMsg = typeof err.response.data === 'string' 
          ? err.response.data 
          : JSON.stringify(err.response.data);
        setError(`Error del servidor (Estado ${err.response.status}): ${serverMsg || 'Credenciales inválidas'}`);
        setErrorDetails(`URL probada: ${err.config?.url || '/auth/login'}\nCódigo: ${err.response.status}`);
      } else if (err.request) {
        // No response received (Network error / Backend down)
        setError('Error de conexión: No se pudo contactar al servidor backend.');
        setErrorDetails(`No hubo respuesta de http://localhost:5124/api/auth/login. Verifica que el servidor Backend esté encendido.`);
      } else {
        setError(`Error inesperado: ${err.message}`);
        setErrorDetails(err.toString());
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-box">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            padding: '16px', 
            borderRadius: '50%', 
            background: 'rgba(79, 70, 229, 0.2)',
            marginBottom: '1rem'
          }}>
            <LogIn size={32} color="#4F46E5" />
          </div>
          <h1>POS Login</h1>
          <p>Ingresa tus credenciales para continuar</p>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.2)', 
            border: '1px solid var(--danger)', 
            padding: '14px', 
            borderRadius: '8px', 
            marginBottom: '16px',
            color: '#FCA5A5',
            fontSize: '0.9rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', marginBottom: '4px' }}>
              <AlertTriangle size={18} /> Error al iniciar sesión
            </div>
            <div>{error}</div>
            {errorDetails && (
              <pre style={{ 
                marginTop: '8px', 
                padding: '8px', 
                background: 'rgba(0,0,0,0.4)', 
                borderRadius: '4px', 
                fontSize: '0.75rem',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                color: '#E2E8F0'
              }}>
                {errorDetails}
              </pre>
            )}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username">Usuario</label>
            <input 
              type="text" 
              id="username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ej. admin, dueno, empleado"
              required 
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ paddingRight: '45px' }}
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px'
                }}
                title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
          </button>
        </form>
        
        <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <p style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px' }}>Cuentas de prueba:</p>
          <p>• Admin: <code>admin</code> / <code>superadmin</code></p>
          <p>• Dueño: <code>antonio</code> / <code>ramirez</code></p>
          <p>• Empleado: <code>juan</code> / <code>junio9dbz</code></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
