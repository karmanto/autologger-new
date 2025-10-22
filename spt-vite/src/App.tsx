import { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
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
            <Route element={
              <>
                <Header mobileMenuOpen={mobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
              </>
            } />

            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={<>admin</>}
            >
            </Route>
          </Routes>
        </main>
      </div>
  );
}

export default App;
