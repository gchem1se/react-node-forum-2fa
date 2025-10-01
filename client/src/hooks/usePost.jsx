import { useState, useEffect } from "react";
import { getPostById } from "../services/post.service";

const usePost = (id) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      setError(false);
      setLoading(true);

      const result = await getPostById(id);

      if (result.ok) {
        setPost(result.data);
      } else {
        setPost(null);
        setError(true);
      }

      setLoading(false);
    })();
  }, [id]);

  return { post, loading, error };
};

export default usePost;
