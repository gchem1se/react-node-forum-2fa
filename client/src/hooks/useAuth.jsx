import { useState, useEffect } from "react";
import { getUser } from "../services/user.service";

const useAuth = () => {
  const [okTOTP, setOkTOTP] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [promptedForTOTP, setPromptedForTOTP] = useState(true);

  useEffect(() => {
    setAuthenticated(true);
    // on page loaded, try to get a user with the already set cookie
  }, []);

  useEffect(() => {
    (async () => {
      // the effect runs on change of "authenticated"
      if (!authenticated) {
        setUser(null); // keep it synced
        setOkTOTP(false); // keep it synced
        return;
      }

      // try to get user info
      setError(false);
      setLoading(true);

      try {
        const result = await getUser();
        if (result.ok) {
          setUser(result.data);
          setOkTOTP(result.data.okTOTP);

          if (result.data.is_admin && !result.data.okTOTP) {
            setPromptedForTOTP(false);
          }
        } else {
          if (result.status !== 401) {
            setError(true);
          }
          setAuthenticated(false); // authenticated was true but API returned 401 => session is expired
        }
      } catch (err) {
        setError(true);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }

      // if here, we got user info in `user`
    })();
  }, [authenticated]);

  return {
    authenticated,
    setAuthenticated,
    user,
    setUser,
    loading,
    setLoading,
    error,
    setError,
    okTOTP,
    setOkTOTP,
    promptedForTOTP,
    setPromptedForTOTP,
  };
};

export default useAuth;
