import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Team from './components/Team';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProjects from './pages/AdminProjects';
import AdminTeam from './pages/AdminTeam';
import AdminRequests from './pages/AdminRequests';
import AdminUsers from './pages/AdminUsers';
import AdminSettings from './pages/AdminSettings';
import AdminServiceRequests from './pages/AdminServiceRequests';
import EmployeeLogin from './pages/EmployeeLogin';
import EmployeePortal from './pages/EmployeePortal';
import ClientLogin from './pages/ClientLogin';
import ClientPortal from './pages/ClientPortal';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Routes>
          <Route
            path="/"
            element={
              <div className="min-h-screen bg-gray-900">
                <Header />
                <main>
                  <Hero />
                  <About />
                  <Services />
                  <Projects />
                  <Team />
                  <Contact />
                </main>
                <Footer />
              </div>
            }
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/admin/team" element={<AdminTeam />} />
          <Route path="/admin/requests" element={<AdminRequests />} />
          <Route path="/admin/service-requests" element={<AdminServiceRequests />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/employee/login" element={<EmployeeLogin />} />
          <Route path="/employee/portal" element={<EmployeePortal />} />
          <Route path="/client/login" element={<ClientLogin />} />
          <Route path="/client/portal" element={<ClientPortal />} />
        </Routes>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
