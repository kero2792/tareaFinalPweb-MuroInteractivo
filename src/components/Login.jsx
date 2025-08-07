import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Login = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    usuario: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Buscar el usuario en Firestore
      const userDoc = await getDoc(doc(db, 'usuarios', formData.usuario));
      
      if (!userDoc.exists()) {
        setError('Usuario no encontrado');
        setLoading(false);
        return;
      }

      const userData = userDoc.data();
      const email = userData.email; // Email generado automáticamente

      // Iniciar sesión con el email generado
      await signInWithEmailAndPassword(auth, email, formData.password);
      alert('Sesión iniciada exitosamente!');
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        setError('Contraseña incorrecta');
      } else if (error.code === 'auth/user-not-found') {
        setError('Usuario no encontrado');
      } else {
        setError('Error al iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Iniciar Sesión</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Usuario:</label>
          <input
            type="text"
            name="usuario"
            value={formData.usuario}
            onChange={handleChange}
            required
            pattern="[a-zA-Z0-9_]+"
            title="Solo letras, números y guiones bajos"
          />
        </div>

        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Iniciando...' : 'Iniciar Sesión'}
        </button>
      </form>

      <p>
        ¿No tienes cuenta?{' '}
        <button className="link-button" onClick={onSwitchToRegister}>
          Registrarse
        </button>
      </p>
    </div>
  );
};

export default Login; 