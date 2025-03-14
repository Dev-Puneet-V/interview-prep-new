import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import createSagaMiddleware from "redux-saga";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

// Import reducers
import counterReducer from "./counter/counterReducer";
import todosReducer from "./todos/todosReducer";
import postsReducer from "./posts/postsReducer";
import { usersApi } from "./users/usersApi";

// Import sagas
import rootSaga from "./sagas";

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Combine reducers
const rootReducer = combineReducers({
  counter: counterReducer,
  todos: todosReducer,
  posts: postsReducer,
  [usersApi.reducerPath]: usersApi.reducer,
});

// Create store with middleware
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(thunk)
      .concat(sagaMiddleware)
      .concat(usersApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

// Run the saga
sagaMiddleware.run(rootSaga);

// Setup listeners for RTK Query
setupListeners(store.dispatch);

// For demonstration purposes, we're also showing how to create a store with the legacy createStore API
export const legacyCreateStore = () => {
  return createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk, sagaMiddleware))
  );
};

/*
 * This file demonstrates:
 * 1. Setting up a Redux store with multiple reducers
 * 2. Configuring middleware (thunk for async actions, saga for complex flows)
 * 3. Setting up Redux DevTools for debugging
 * 4. Integrating RTK Query for data fetching
 * 5. Showing both modern (configureStore) and legacy (createStore) approaches
 */
