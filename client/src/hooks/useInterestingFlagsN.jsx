import { useContext, useState, useEffect } from "react";
import { getInterestingFlagsN } from "../services/comment.service";
import { ErrorCodes } from "../constants/errors";
import { AuthContext } from "../contexts/AuthContext";
import { ToastsContext } from "../contexts/ToastsContext";
import { ERROR_MESSAGES } from "../constants/errors";

const useInterestingFlagsN = (id, markedState, isUserAuthor) => {
  const [interestingFlagsN, setInterestingFlagsN] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { user, setAuthenticated } = useContext(AuthContext);
  const { enqueue } = useContext(ToastsContext);

  useEffect(() => {
    (async () => {
      setError(false);
      setLoading(true);

      if ((!markedState && !isUserAuthor) || user === null) {
        // it's useless to fetch
        setInterestingFlagsN(null);
        setLoading(false);
        setError(true);
        return;
      }

      const result = await getInterestingFlagsN(id);

      if (result.ok) {
        setInterestingFlagsN(result.data);
      } else if (result.status === 401 && user) {
        enqueue({
          title: "Error",
          message: "Your session is expired.",
          variant: "danger",
          delay: 3000,
        });
        setError(true);
        setAuthenticated(false);
      // } else if (result.status === 401 && !user) {
      //   // ignore, only happens when user logs out from the details page.
      //   // ignoring to not trigger any error.
      } else if (result.error) {
        enqueue({
          title: "Error",
          message: ERROR_MESSAGES[result.error],
          variant: "danger",
          delay: 3000,
        });
        setError(true);
      } else {
        enqueue({
          title: "Error",
          message: ERROR_MESSAGES[ErrorCodes.GETTING_INTERESTING_FLAGS_COUNT],
          variant: "danger",
          delay: 3000,
        });
        setError(true);
      }

      setLoading(false);
    })();
  }, [id, markedState, isUserAuthor]);

  return { interestingFlagsN, loading, error };
};

export default useInterestingFlagsN;
