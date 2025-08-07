import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          // Buscar el usuario por UID en Firestore
          // Necesitamos buscar por UID, no por usuario
          // Esto requiere una consulta diferente
          const userQuery = await getDoc(doc(db, 'usuarios', auth.currentUser.uid));
          if (userQuery.exists()) {
            setUserData(userQuery.data());
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'posts'), {
        content: content.trim(),
        userId: auth.currentUser.uid,
        userName: userData ? `${userData.nombre} ${userData.apellido}` : auth.currentUser.email,
        userUsuario: userData ? userData.usuario : 'usuario',
        createdAt: serverTimestamp()
      });
      
      setContent('');
      alert('Post publicado exitosamente!');
    } catch {
      alert('Error al publicar el post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post">
      <h3>Crear Nueva Publicación</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="¿Qué quieres compartir?"
          rows="4"
          required
        />
        <button type="submit" disabled={loading || !content.trim()}>
          {loading ? 'Publicando...' : 'Publicar'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost; 