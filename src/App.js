import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute';

import AuthPage from './components/AuthPage';
import PatientDashboard from './components/PatientDashboard';
import DermatologistDashboard from './components/DentistDashboard/indexDermatologist';
import CreateDermatologistUser from './components/CreateDentistUser/CreateDermatologistUser';
import RequestedStatus from './components/RequestedStatus/RequestedStatus';
import AddDermatologistForm from './components/AddDentistForm/AddDermatologistForm';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import PaymentStatus from './components/PaymentStatus';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dermatologists" element={
          <ProtectedRoute requiredRole="patient">
            <PatientDashboard />
          </ProtectedRoute>
        } />
        <Route path="/patients" element={
          <ProtectedRoute requiredRole="dermatologist">
            <DermatologistDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/create-dermatologist" element={<CreateDermatologistUser />} />
        <Route path="/requested-status" element={<RequestedStatus />} />
        <Route path="/admin/add-dermatologist" element={<AddDermatologistForm />} />
        <Route path="/admin" element={<AdminLogin/>} />
        <Route path='/admin/dashboard' element={<AdminDashboard/>} />
        <Route path='/payment-status' element={<PaymentStatus/>} />
        {/* Catch-all route for client-side routing */}
        <Route path="*" element={<AuthPage />} />
      </Routes>

      {/* ✅ Add ToastContainer once here */}
      <ToastContainer position="top-right" autoClose={2000} />
    </Router>
  );
}

export default App;
