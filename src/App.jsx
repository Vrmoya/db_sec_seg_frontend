// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import EditorDashboard from './pages/EditorDashboard';
import UsersDashboard from './pages/UsersDashboard';
import Unauthorized from './pages/Unauthorized';
import CardDetail from './components/CardDetail'; // ✅ NUEVO

function ProtectedRoute({ children, allowedRoles }) {
  const { token, user } = useSelector((state) => state.auth);

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔁 Redirección raíz */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* 🔐 Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* 🧑‍💼 Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/editor"
          element={
            <ProtectedRoute allowedRoles={['editor', 'admin']}>
              <EditorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UsersDashboard />
            </ProtectedRoute>
          }
        />

        {/* 📦 Detalle de card */}
        <Route
          path="/cards/:id"
          element={
            <ProtectedRoute allowedRoles={['viewer', 'editor', 'admin']}>
              <CardDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}