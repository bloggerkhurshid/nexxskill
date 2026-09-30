import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthModalProvider } from './context/AuthModalContext';
import { WebinarModalProvider } from './context/WebinarModalContext';
import { Header, Footer } from './components/Navigation';
import { Home } from './pages/Home';
import { Courses } from './pages/Courses';
import { Webinars, Resources } from './pages/Webinars';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Register } from './pages/Register';
import { Login, Signup } from './pages/Auth';
import { StudentDashboard } from './pages/StudentDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PrivacyPolicy, TermsOfService, RefundPolicy } from './pages/Legal';

import { ScrollToTop } from './components/ScrollToTop';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AuthModalProvider>
            <WebinarModalProvider>
              <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#080e1a] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/webinars" element={<Webinars />} />
                    <Route path="/resources" element={<Resources />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    
                    {/* Legal Pages */}
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/refund-policy" element={<RefundPolicy />} />

                    {/* Protected Student Portal */}
                    <Route element={<ProtectedRoute />}>
                      <Route path="/student/dashboard" element={<StudentDashboard />} />
                    </Route>
                  </Routes>
                </main>
                <Footer />
              </div>
            </WebinarModalProvider>
          </AuthModalProvider>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
