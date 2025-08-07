import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    usuario: '',
    clave: '',
    nombre: '',
    apellido: ''
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
      // Verificar si el usuario ya existe
      const userQuery = await getDoc(doc(db, 'usuarios', formData.usuario));
      if (userQuery.exists()) {
        setError('El nombre de usuario ya está en uso');
        setLoading(false);
        return;
      }

      // Crear email único basado en el usuario
      const email = `${formData.usuario}@murointeractivo.com`;
      
      // Crear usuario con email y contraseña
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        email, 
        formData.clave
      );

      // Guardar datos en Firestore usando el UID como ID principal
      await setDoc(doc(db, 'usuarios', userCredential.user.uid), {
        usuario: formData.usuario,
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: email,
        createdAt: new Date()
      });

      // También crear un documento con el nombre de usuario como ID para búsquedas
      await setDoc(doc(db, 'usuarios', formData.usuario), {
        uid: userCredential.user.uid,
        usuario: formData.usuario,
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: email,
        createdAt: new Date()
      });

      alert('Usuario registrado exitosamente!');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('El nombre de usuario ya está en uso');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Crear Cuenta</h2>
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
            minLength="3"
            pattern="[a-zA-Z0-9_]+"
            title="Solo letras, números y guiones bajos"
          />
        </div>

        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            name="clave"
            value={formData.clave}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>

        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Apellido:</label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

      <p>
        ¿Ya tienes cuenta?{' '}
        <button className="link-button" onClick={onSwitchToLogin}>
          Iniciar Sesión
        </button>
      </p>
    </div>
  );
};

export default Register; 