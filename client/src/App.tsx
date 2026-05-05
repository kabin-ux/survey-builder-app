import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import AdminPage from './pages/AdminPage';
import SurveyPage from './pages/SurveyPage';
import AnalyticsPage from './pages/AnalyticsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App(): React.ReactElement {
  return (
    <AuthProvider>
      <Toaster position="top-center" />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/create" element={<AdminPage mode="create" />} />
          <Route path="/admin/edit/:id" element={<AdminPage mode="edit" />} />
          <Route path="/survey/:id" element={<SurveyPage />} />
          <Route path="/analytics/:id" element={<AnalyticsPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
