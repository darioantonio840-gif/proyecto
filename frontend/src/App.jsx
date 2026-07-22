import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import EmployeeDashboard from './components/EmployeeDashboard';
import OwnerDashboard from './components/OwnerDashboard';
import AdminDashboard from './components/AdminDashboard';

const ProtectedRoute = ({ children, roleRequired }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roleRequired && role !== roleRequired) {
    return <Navigate to="/login" />;
  }

  return children;
};

const DefaultRoute = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  if (isAuthenticated) {
    if (role === 'Owner') return <Navigate to="/owner" />;
    if (role === 'Admin') return <Navigate to="/admin" />;
    return <Navigate to="/employee" />;
  }
  
  return <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route 
          path="/employee" 
          element={
            <ProtectedRoute roleRequired="Employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/owner" 
          element={
            <ProtectedRoute roleRequired="Owner">
              <OwnerDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute roleRequired="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="*" 
          element={<DefaultRoute />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
