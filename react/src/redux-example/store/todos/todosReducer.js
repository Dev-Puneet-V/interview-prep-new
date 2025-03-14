// Action Types
export const ADD_TODO = "todos/ADD_TODO";
export const TOGGLE_TODO = "todos/TOGGLE_TODO";
export const DELETE_TODO = "todos/DELETE_TODO";
export const FETCH_TODOS_REQUEST = "todos/FETCH_TODOS_REQUEST";
export const FETCH_TODOS_SUCCESS = "todos/FETCH_TODOS_SUCCESS";
export const FETCH_TODOS_FAILURE = "todos/FETCH_TODOS_FAILURE";

// Action Creators
export const addTodo = (text) => ({
  type: ADD_TODO,
  payload: {
    id: Date.now(),
    text,
    completed: false,
  },
});

export const toggleTodo = (id) => ({
  type: TOGGLE_TODO,
  payload: id,
});

export const deleteTodo = (id) => ({
  type: DELETE_TODO,
  payload: id,
});

// Async Action Creators (using Redux Thunk)
export const fetchTodos = () => async (dispatch) => {
  dispatch({ type: FETCH_TODOS_REQUEST });

  try {
    // Simulate API call
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, text: "Learn Redux", completed: true },
          { id: 2, text: "Learn Redux Thunk", completed: false },
          { id: 3, text: "Build a Redux app", completed: false },
        ]);
      }, 1000);
    });

    dispatch({
      type: FETCH_TODOS_SUCCESS,
      payload: response,
    });
  } catch (error) {
    dispatch({
      type: FETCH_TODOS_FAILURE,
      payload: error.message,
    });
  }
};

// Initial State
const initialState = {
  todos: [],
  loading: false,
  error: null,
};

// Reducer
const todosReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };

    case TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };

    case DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };

    case FETCH_TODOS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_TODOS_SUCCESS:
      return {
        ...state,
        loading: false,
        todos: action.payload,
      };

    case FETCH_TODOS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default todosReducer;

/*
 * This file demonstrates:
 * 1. Redux Thunk for handling asynchronous actions
 * 2. Loading states and error handling
 * 3. More complex state updates (adding, toggling, deleting items)
 * 4. Simulating API calls with promises
 */
