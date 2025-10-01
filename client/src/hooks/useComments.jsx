import { useState, useEffect, useContext } from "react";
import { getPostComments } from "../services/comment.service";
import { getRelatedCommentsN } from "../services/post.service";
import { CommentsCollection } from "../models/comment.model";
import { AuthContext } from "../contexts/AuthContext";
import { ToastsContext } from "../contexts/ToastsContext";

const useComments = (id, stale, setStale) => {
  const { user, setAuthenticated } = useContext(AuthContext);
  const { enqueue } = useContext(ToastsContext);
  const [comments, setComments] = useState(new CommentsCollection());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [commentsCount, setCommentsCount] = useState(null);

  useEffect(() => {
    (async () => {
      setError(false);
      setLoading(true);

      const result = await getPostComments(id);
      const count = await getRelatedCommentsN(id);

      if (result.ok && count.ok) {
        setComments(result.data);
        setCommentsCount(count.data.related_comments_n);
        if (result.onlyAnon && user) {
          enqueue({
            title: "Error",
            message: "Your session is expired.",
            variant: "danger",
            delay: 3000,
          });
          setAuthenticated(false);
        }
      } else {
        setComments(new CommentsCollection());
        setCommentsCount(-1);
        setError(true);
        setLoading(false);
      }

      setStale(false);
      setLoading(false);
    })();
  }, [user, id, stale]);

  return { comments, loading, error, commentsCount };
};

export default useComments;
