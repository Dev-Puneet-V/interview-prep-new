import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addTodo,
  toggleTodo,
  deleteTodo,
  fetchTodos,
} from "../../store/todos/todosReducer";

const TodosContainer = () => {
  const { todos, loading, error } = useSelector((state) => state.todos);
  const dispatch = useDispatch();
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      dispatch(addTodo(newTodo));
      setNewTodo("");
    }
  };

  if (error) {
    return <div className="alert alert-error">Error: {error}</div>;
  }

  return (
    <div className="card">
      <h2 className="section-title">Redux Thunk Example: Todo List</h2>

      <div className="explanation">
        <p>This example demonstrates Redux Thunk for async operations:</p>
        <ul>
          <li>Fetching data asynchronously</li>
          <li>Handling loading states</li>
          <li>Error handling</li>
          <li>Creating, toggling, and deleting todos</li>
        </ul>
      </div>

      <form onSubmit={handleAddTodo} className="form-group">
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            className="form-control"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo"
          />
          <button type="submit" className="btn btn-primary">
            Add Todo
          </button>
        </div>
      </form>

      {loading ? (
        <div className="loading">Loading todos...</div>
      ) : (
        <ul className="todo-list">
          {todos.length === 0 ? (
            <li className="todo-item">No todos yet. Add one above!</li>
          ) : (
            todos.map((todo) => (
              <li
                key={todo.id}
                className={`todo-item ${todo.completed ? "completed" : ""}`}
              >
                <span className="todo-item-text">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => dispatch(toggleTodo(todo.id))}
                  />{" "}
                  {todo.text}
                </span>
                <button
                  className="btn btn-danger"
                  onClick={() => dispatch(deleteTodo(todo.id))}
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      )}

      <div className="code-block">
        <pre>{`
// Async action with Redux Thunk
export const fetchTodos = () => async (dispatch) => {
  dispatch({ type: FETCH_TODOS_REQUEST });
  
  try {
    const response = await api.getTodos();
    dispatch({
      type: FETCH_TODOS_SUCCESS,
      payload: response
    });
  } catch (error) {
    dispatch({
      type: FETCH_TODOS_FAILURE,
      payload: error.message
    });
  }
};

// Using the async action in a component
useEffect(() => {
  dispatch(fetchTodos());
}, [dispatch]);
        `}</pre>
      </div>
    </div>
  );
};

export default TodosContainer;
