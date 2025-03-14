# Comprehensive Redux Guide

This guide explains the core concepts of Redux and its ecosystem, including Redux Thunk, Redux Saga, and RTK Query.

## Table of Contents

1. [Redux Basics](#redux-basics)
2. [Redux Middleware](#redux-middleware)
3. [Redux Thunk](#redux-thunk)
4. [Redux Saga](#redux-saga)
5. [Redux Toolkit (RTK)](#redux-toolkit-rtk)
6. [RTK Query](#rtk-query)
7. [Performance Optimization](#performance-optimization)
8. [Code Splitting with Redux](#code-splitting-with-redux)
9. [Best Practices](#best-practices)

## Redux Basics

### What is Redux?

Redux is a predictable state container for JavaScript applications. It helps you write applications that behave consistently, run in different environments, and are easy to test.

### Core Concepts

1. **Store**: A single source of truth that holds the entire state of your application.
2. **Actions**: Plain JavaScript objects that describe what happened in the application.
3. **Reducers**: Pure functions that take the current state and an action, and return a new state.
4. **Dispatch**: The method used to send actions to the store.
5. **Selectors**: Functions that extract specific pieces of data from the store state.

### Basic Example

```javascript
// Action Types
const INCREMENT = "counter/INCREMENT";
const DECREMENT = "counter/DECREMENT";

// Action Creators
const increment = () => ({ type: INCREMENT });
const decrement = () => ({ type: DECREMENT });

// Reducer
const initialState = { value: 0 };
const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT:
      return { ...state, value: state.value + 1 };
    case DECREMENT:
      return { ...state, value: state.value - 1 };
    default:
      return state;
  }
};

// Store
const store = createStore(counterReducer);

// Dispatching Actions
store.dispatch(increment());
console.log(store.getState()); // { value: 1 }
```

## Redux Middleware

Middleware provides a third-party extension point between dispatching an action and the moment it reaches the reducer. It's commonly used for logging, crash reporting, handling asynchronous actions, routing, and more.

### How Middleware Works

```javascript
// Simple logging middleware
const loggingMiddleware = (store) => (next) => (action) => {
  console.log("Before:", store.getState());
  console.log("Action:", action);
  const result = next(action);
  console.log("After:", store.getState());
  return result;
};

// Applying middleware
const store = createStore(rootReducer, applyMiddleware(loggingMiddleware));
```

## Redux Thunk

Redux Thunk is middleware that allows you to write action creators that return a function instead of an action. This is particularly useful for handling asynchronous logic like API calls.

### How Thunk Works

```javascript
// Without Thunk
const fetchUserSuccess = (user) => ({
  type: "FETCH_USER_SUCCESS",
  payload: user,
});

// With Thunk
const fetchUser = (id) => async (dispatch) => {
  dispatch({ type: "FETCH_USER_REQUEST" });

  try {
    const response = await api.fetchUser(id);
    dispatch({ type: "FETCH_USER_SUCCESS", payload: response.data });
  } catch (error) {
    dispatch({ type: "FETCH_USER_FAILURE", payload: error.message });
  }
};

// Usage
dispatch(fetchUser(123));
```

### When to Use Thunk

- For simple async operations
- When you need to dispatch multiple actions in sequence
- When you need to access the current state before dispatching

## Redux Saga

Redux Saga is a middleware library that aims to make application side effects (like asynchronous operations) easier to manage, more efficient to execute, simple to test, and better at handling failures.

### Key Concepts

- **Sagas**: Generator functions that yield objects to the redux-saga middleware
- **Effects**: Plain JavaScript objects that instruct the middleware to perform some operation
- **Workers**: Sagas that perform a specific task
- **Watchers**: Sagas that watch for dispatched actions and fork worker sagas

### Common Effects

- `call`: Calls a function (usually an API call)
- `put`: Dispatches an action
- `takeLatest`: Takes only the latest call of a specific action
- `takeEvery`: Takes every call of a specific action
- `select`: Retrieves data from the Redux store
- `fork`: Performs a non-blocking operation
- `all`: Combines multiple effects

### Example

```javascript
import { call, put, takeLatest } from "redux-saga/effects";

// Worker Saga
function* fetchUserSaga(action) {
  try {
    const user = yield call(api.fetchUser, action.payload);
    yield put({ type: "FETCH_USER_SUCCESS", payload: user });
  } catch (error) {
    yield put({ type: "FETCH_USER_FAILURE", payload: error.message });
  }
}

// Watcher Saga
function* watchFetchUser() {
  yield takeLatest("FETCH_USER_REQUEST", fetchUserSaga);
}

// Root Saga
export default function* rootSaga() {
  yield all([
    watchFetchUser(),
    // other sagas
  ]);
}
```

### When to Use Saga

- For complex async flows
- When you need to handle race conditions
- For operations that need to be cancelled
- When you need more fine-grained control over async operations

## Redux Toolkit (RTK)

Redux Toolkit is the official, opinionated, batteries-included toolset for efficient Redux development. It simplifies common Redux use cases and reduces boilerplate.

### Key Features

- **configureStore**: Simplified store setup with good defaults
- **createReducer**: Simplifies reducer logic with immutable updates
- **createAction**: Generates action creators
- **createSlice**: Combines reducer logic and actions
- **createAsyncThunk**: Simplified async logic

### Example

```javascript
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await fetch("https://api.example.com/users");
  return response.json();
});

// Slice
const usersSlice = createSlice({
  name: "users",
  initialState: {
    entities: [],
    loading: "idle",
    error: null,
  },
  reducers: {
    // Standard reducers
    userAdded(state, action) {
      state.entities.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    // Handle async actions
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = "idle";
        state.entities = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = "idle";
        state.error = action.error.message;
      });
  },
});

export const { userAdded } = usersSlice.actions;
export default usersSlice.reducer;
```

## RTK Query

RTK Query is a powerful data fetching and caching tool built into Redux Toolkit. It simplifies the process of loading data from a server, transforming it, and caching the results.

### Key Features

- **Automated re-fetching**: Automatically refetch data when needed
- **Dedupe requests**: Avoid duplicate requests for the same data
- **Caching and cache invalidation**: Efficiently manage cached data
- **Polling**: Periodically refresh data
- **Mutations**: Update server data and automatically update the cache
- **Prefetching**: Load data before it's needed

### Example

```javascript
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.example.com/" }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => "posts",
      providesTags: ["Post"],
    }),
    addPost: builder.mutation({
      query: (post) => ({
        url: "posts",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["Post"],
    }),
  }),
});

export const { useGetPostsQuery, useAddPostMutation } = api;

// In a component
function PostsList() {
  const { data, isLoading } = useGetPostsQuery();
  const [addPost] = useAddPostMutation();

  // Use the data and mutations
}
```

## Performance Optimization

### Reselect for Memoized Selectors

```javascript
import { createSelector } from "reselect";

// Input selectors
const getTodos = (state) => state.todos;
const getFilter = (state) => state.filter;

// Memoized selector
const getVisibleTodos = createSelector(
  [getTodos, getFilter],
  (todos, filter) => {
    switch (filter) {
      case "SHOW_COMPLETED":
        return todos.filter((todo) => todo.completed);
      case "SHOW_ACTIVE":
        return todos.filter((todo) => !todo.completed);
      default:
        return todos;
    }
  }
);

// Usage
const visibleTodos = useSelector(getVisibleTodos);
```

### Normalizing State Shape

```javascript
// Normalized state
{
  entities: {
    users: {
      byId: {
        '1': { id: '1', name: 'John' },
        '2': { id: '2', name: 'Jane' }
      },
      allIds: ['1', '2']
    }
  }
}

// Accessing data
const user = state.entities.users.byId[userId];
const allUsers = state.entities.users.allIds.map(id => state.entities.users.byId[id]);
```

## Code Splitting with Redux

### Dynamic Reducer Injection

```javascript
// Store setup with reducer injection
const store = configureStore({
  reducer: {
    // Static reducers
    app: appReducer,
    // Dynamic reducers will be added later
  },
});

// Inject reducer dynamically
store.injectReducer = (key, reducer) => {
  store.replaceReducer(
    combineReducers({
      ...store.staticReducers,
      [key]: reducer,
    })
  );
};

// Usage in a lazy-loaded component
const SomeFeature = () => {
  useEffect(() => {
    // Dynamically import the reducer
    import("./featureReducer").then((module) => {
      store.injectReducer("feature", module.default);
    });
  }, []);

  return <div>Feature Component</div>;
};
```

### Lazy Loading Redux Modules

```javascript
// Main app
const App = () => (
  <Provider store={store}>
    <Router>
      <Route path="/" exact component={Home} />
      <Route
        path="/feature"
        component={React.lazy(() => import("./Feature"))}
      />
    </Router>
  </Provider>
);

// Feature.js (lazy loaded)
import { useDispatch } from "react-redux";
import { actions } from "./featureSlice";

const Feature = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize feature state when loaded
    dispatch(actions.initialize());
  }, [dispatch]);

  return <div>Feature Component</div>;
};
```

## Best Practices

### State Structure

- Keep state normalized (avoid nesting)
- Use IDs for relationships between entities
- Keep state minimal (derive data when possible)

### Action Design

- Use action creators instead of writing action objects directly
- Use descriptive action types (domain/eventName)
- Consider using action type constants

### Reducer Design

- Keep reducers pure and simple
- Use combineReducers to split logic
- Use immutable update patterns

### Middleware Usage

- Choose the right middleware for your needs
- Compose middleware in the right order
- Consider using middleware for cross-cutting concerns

### Performance

- Use memoized selectors with Reselect
- Avoid unnecessary re-renders with React.memo and useSelector
- Be mindful of how much data you're storing

### Testing

- Test action creators, reducers, and selectors separately
- Use mock stores for testing connected components
- Test async logic with appropriate middleware

### Code Organization

- Feature-based organization (group by feature, not by type)
- Co-locate related files
- Consider using the "ducks" pattern or Redux Toolkit slices
