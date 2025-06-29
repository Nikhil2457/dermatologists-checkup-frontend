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
import LandingPage from './components/LandingPage';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import RefundPolicy from './components/RefundPolicy';
import ContactUs from './components/ContactUs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/refund" element={<RefundPolicy />} />
        <Route path="/contact" element={<ContactUs />} />
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
        <Route path="*" element={<LandingPage />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={2000} />
    </Router>
  );
}

export default App;
