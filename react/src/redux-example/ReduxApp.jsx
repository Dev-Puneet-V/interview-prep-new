import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { store } from "./store";

// Lazy loaded components for code splitting
const TodosContainer = React.lazy(() =>
  import("./components/todos/TodosContainer")
);
const PostsContainer = React.lazy(() =>
  import("./components/posts/PostsContainer")
);
const UsersContainer = React.lazy(() =>
  import("./components/users/UsersContainer")
);
const CounterContainer = React.lazy(() =>
  import("./components/counter/CounterContainer")
);

import "./ReduxApp.css";

const ReduxApp = () => {
  return (
    <Provider store={store}>
      <div className="redux-app">
        <h1>Redux Learning Application</h1>
        <p>This application demonstrates various Redux concepts and patterns</p>

        <Router>
          <nav className="redux-nav">
            <ul>
              <li>
                <Link to="/redux/counter">Counter (Basic Redux)</Link>
              </li>
              <li>
                <Link to="/redux/todos">Todos (Redux Thunk)</Link>
              </li>
              <li>
                <Link to="/redux/posts">Posts (Redux Saga)</Link>
              </li>
              <li>
                <Link to="/redux/users">Users (RTK Query)</Link>
              </li>
            </ul>
          </nav>

          <div className="redux-content">
            <React.Suspense
              fallback={<div className="loading">Loading...</div>}
            >
              <Routes>
                <Route path="/redux/counter" element={<CounterContainer />} />
                <Route path="/redux/todos" element={<TodosContainer />} />
                <Route path="/redux/posts" element={<PostsContainer />} />
                <Route path="/redux/users" element={<UsersContainer />} />
                <Route
                  path="/redux/*"
                  element={<div>Select a demo from the navigation</div>}
                />
              </Routes>
            </React.Suspense>
          </div>
        </Router>
      </div>
    </Provider>
  );
};

export default ReduxApp;
