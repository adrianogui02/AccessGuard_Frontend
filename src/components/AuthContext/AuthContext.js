// AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AuthActions = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
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
  user: null,
  logged: false,
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialAuthState);

  const setAuthState = (payload) => {
    dispatch({ type: AuthActions.LOGIN, payload });
  };

  useEffect(() => {
    // Load user information from localStorage on initial render
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setAuthState({ user: JSON.parse(storedUser) });
    }
  }, []);

  useEffect(() => {
    // Save user information to localStorage whenever authState changes
    localStorage.setItem('user', JSON.stringify(authState.user));
  }, [authState]);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
