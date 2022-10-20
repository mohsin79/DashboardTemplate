import React, { Dispatch } from 'react';
import { initialState as State, appReducer, IAction, adminSlice, } from './adminReducer'
import { initialState } from './adminReducer'
import { configureStore } from '@reduxjs/toolkit'
import { formReducer } from './appreducer';


const Store = React.createContext<[
  typeof State,
  React.Dispatch<IAction>
]>([initialState, () => { }]);


Store.displayName = 'Store';


export const useStore = () => React.useContext(Store);

export const StoreProvider = ({ children, initialState, reducer }: { children: JSX.Element, initialState: typeof State, reducer: typeof appReducer }) => {

  const [globalState, dispatch] = React.useReducer(reducer, initialState);

  return (
    <Store.Provider value={[globalState!, dispatch]}>{children}</Store.Provider>
  );
};

// ...

export const store = configureStore({
  reducer: {
    admin: adminSlice.reducer,
    appform: formReducer
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch