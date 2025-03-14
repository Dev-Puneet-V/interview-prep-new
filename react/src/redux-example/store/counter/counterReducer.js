// Action Types
export const INCREMENT = "counter/INCREMENT";
export const DECREMENT = "counter/DECREMENT";
export const RESET = "counter/RESET";
export const SET_VALUE = "counter/SET_VALUE";

// Action Creators
export const increment = (amount = 1) => ({
  type: INCREMENT,
  payload: amount,
});

export const decrement = (amount = 1) => ({
  type: DECREMENT,
  payload: amount,
});

export const reset = () => ({
  type: RESET,
});

export const setValue = (value) => ({
  type: SET_VALUE,
  payload: value,
});

// Initial State
const initialState = {
  value: 0,
  lastAction: null,
};

// Reducer
const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT:
      return {
        ...state,
        value: state.value + action.payload,
        lastAction: "INCREMENT",
      };
    case DECREMENT:
      return {
        ...state,
        value: state.value - action.payload,
        lastAction: "DECREMENT",
      };
    case RESET:
      return {
        ...state,
        value: 0,
        lastAction: "RESET",
      };
    case SET_VALUE:
      return {
        ...state,
        value: action.payload,
        lastAction: "SET_VALUE",
      };
    default:
      return state;
  }
};

export default counterReducer;

/*
 * This file demonstrates:
 * 1. Basic Redux action types and action creators
 * 2. A simple reducer function that handles different actions
 * 3. Immutable state updates using the spread operator
 * 4. Tracking additional state (lastAction) to demonstrate state changes
 */
