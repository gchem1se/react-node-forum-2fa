import { useState, useEffect } from "react";
import { PostsCollection } from "../models/post.model";
import { getPosts } from "../services/post.service";

const usePosts = (stale, setStale) => {
  const [posts, setPosts] = useState(new PostsCollection());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      setError(false);
      setLoading(true);

      const result = await getPosts();

      if (result.ok) {
        setPosts(result.data);
      } else {
        setPosts(new PostsCollection());
        setError(true);
      }

      setStale(false);
      setLoading(false);
    })();
  }, [stale]);

  return { posts, loading, error };
};

export default usePosts;
