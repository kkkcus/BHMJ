// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Recommend from './pages/Recommend';
import Cart from './pages/Cart';
import RecipeDetail from './pages/RecipeDetail';
import MyMenu from './pages/MyMenu';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/recommend" element={<ProtectedRoute><Recommend /></ProtectedRoute>} />
      <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
      <Route path="/recipe/:title" element={<ProtectedRoute><RecipeDetail /></ProtectedRoute>} />
      <Route path="/my-menu" element={<ProtectedRoute><MyMenu /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
