import React, { createContext } from "react";
import useAuth from "../hooks/useAuth";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const {
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
  } = useAuth();

  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
