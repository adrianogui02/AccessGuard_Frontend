import React, { createContext, useContext, useReducer, useEffect } from "react";

const AuthActions = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
};

const authReducer = (state, action) => {
  switch (action.type) {
    case AuthActions.LOGIN:
      return {
        ...state,
        user: action.payload.user,
        logged: true,
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
        logged: false,
      };
    default:
      return state;
  }
};

const initialAuthState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  logged: !!localStorage.getItem("user"),
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialAuthState);

  const setAuthState = (payload) => {
    dispatch({ type: AuthActions.LOGIN, payload });
  };

  useEffect(() => {
    // Load user information from localStorage on initial render
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch({
        type: AuthActions.LOGIN,
        payload: { user: JSON.parse(storedUser) },
      });
    }
  }, []);

  useEffect(() => {
    // Save or remove user information from localStorage whenever authState changes
    if (authState.user) {
      localStorage.setItem("user", JSON.stringify(authState.user));
    } else {
      localStorage.removeItem("user");
    }
  }, [authState.user]);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
