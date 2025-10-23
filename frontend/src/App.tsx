import { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MachineStatus from './pages/MachineStatus'; // Import the new component
import Login from './pages/Login';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  return (
      <div className="min-h-screen bg-white">
        <main role="main">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Header mobileMenuOpen={mobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
                  <MachineStatus />
                </>
              }
            />

            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<>admin</>} />
          </Routes>
        </main>
      </div>
  );
}

export default App;
