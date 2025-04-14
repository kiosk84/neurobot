import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Типы состояния
type AppState = {
  posts: any[];
  user: any | null;
  isLoading: boolean;
  error: string | null;
};

// Типы действий
type AppAction =
  | { type: 'POST_LOADING' }
  | { type: 'POST_SUCCESS'; payload: any[] }
  | { type: 'POST_ERROR'; payload: string }
  | { type: 'USER_AUTH'; payload: any | null }
  | { type: 'USER_LOGOUT' };

// Начальное состояние
const initialState: AppState = {
  posts: [],
  user: null,
  isLoading: false,
  error: null
};

// Редуктор
function reducer(state: AppState, action: AppAction): AppState {
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

// Создаем контекст
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => null
});

// Провайдер контекста
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Хук для использования контекста
export const useAppContext = () => useContext(AppContext);
