import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Batches from './pages/Batches';
import Eggs from './pages/Eggs';
import Incubators from './pages/Incubators';
import IncubationBatches from './pages/IncubationBatches';
import Health from './pages/Health';
import Settings from './pages/Settings';
import Farms from './pages/Farms';
import Sheds from './pages/Sheds';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/batches" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Batches />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/eggs" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Eggs />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/incubators" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Incubators />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/incubation-batches" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <IncubationBatches />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/health" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Health />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/farms" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Farms />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/sheds" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Sheds />
                  </Layout>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;