import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import PostList from './components/PostList';
import CreatePost from './components/CreatePost';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // Buscar datos del usuario en Firestore
          const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Muro Interactivo</h1>
        <div className="header-actions">
          {user ? (
            <div className="user-info">
              <span>
                Hola, {userData ? `${userData.nombre} ${userData.apellido}` : user.email}
              </span>
              <button onClick={handleLogout} className="logout-btn">
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button 
                className="login-btn"
                onClick={() => setShowLoginModal(true)}
              >
                Iniciar Sesión
              </button>
              <button 
                className="register-btn"
                onClick={() => setShowRegisterModal(true)}
              >
                Registrarse
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="app-main">
        {user ? (
          <div className="authenticated-content">
            <CreatePost />
            <PostList />
          </div>
        ) : (
          <div className="guest-content">
            <div className="welcome-section">
              <h2>Bienvenido al Muro Interactivo</h2>
              <p>Regístrate o inicia sesión para comenzar a publicar</p>
              <p>Desarrollado por Enmanuel Guerrero Santana (2024-0275)</p>
            </div>
            <PostList />
          </div>
        )}
      </main>

      {/* Modales */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />
      
      <RegisterModal 
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  );
}

export default App;
