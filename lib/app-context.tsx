'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface AppState {
  posts: any[];
  user: any | null; 
  isLoading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'POST_LOADING' }
  | { type: 'POST_SUCCESS'; payload: any[] }
  | { type: 'POST_ERROR'; payload: string }
  | { type: 'USER_AUTH'; payload: any | null }
  | { type: 'USER_LOGOUT' };

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const initialState: AppState = {
  posts: [],
  user: null,
  isLoading: false, 
  error: null
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'POST_LOADING':
      return { ...state, isLoading: true, error: null };
    case 'POST_SUCCESS':
      return { ...state, posts: action.payload, isLoading: false };
    case 'POST_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'USER_AUTH':
      return { ...state, user: action.payload };
    case 'USER_LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
