import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha no disponible';
    const date = timestamp.toDate();
    return date.toLocaleString('es-ES');
  };

  if (loading) {
    return <div className="loading">Cargando publicaciones...</div>;
  }

  return (
    <div className="post-list">
      <h2>Muro Interactivo</h2>
      {posts.length === 0 ? (
        <p className="no-posts">No hay publicaciones aún. ¡Sé el primero en publicar!</p>
      ) : (
        posts.map(post => (
          <div key={post.id} className="post">
            <div className="post-header">
              <span className="user-name">
                {post.userName || post.userUsuario || 'Usuario'}
              </span>
              <span className="post-date">{formatDate(post.createdAt)}</span>
            </div>
            <div className="post-content">
              {post.content}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PostList; 