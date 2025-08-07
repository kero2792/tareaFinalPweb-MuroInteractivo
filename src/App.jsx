import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import Auth from './components/Auth';
import PostList from './components/PostList';
import CreatePost from './components/CreatePost';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Muro Interactivo</h1>
        {user && (
          <div className="user-info">
            <span>
              Hola, {userData ? `${userData.nombre} ${userData.apellido}` : user.email}
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Cerrar Sesión
            </button>
          </div>
        )}
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
            </div>
            <PostList />
            <Auth />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
