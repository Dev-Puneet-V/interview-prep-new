// Action Types
export const FETCH_POSTS_REQUEST = "posts/FETCH_POSTS_REQUEST";
export const FETCH_POSTS_SUCCESS = "posts/FETCH_POSTS_SUCCESS";
export const FETCH_POSTS_FAILURE = "posts/FETCH_POSTS_FAILURE";
export const FETCH_POST_DETAILS_REQUEST = "posts/FETCH_POST_DETAILS_REQUEST";
export const FETCH_POST_DETAILS_SUCCESS = "posts/FETCH_POST_DETAILS_SUCCESS";
export const FETCH_POST_DETAILS_FAILURE = "posts/FETCH_POST_DETAILS_FAILURE";

// Action Creators
export const fetchPosts = () => ({
  type: FETCH_POSTS_REQUEST,
});

export const fetchPostDetails = (id) => ({
  type: FETCH_POST_DETAILS_REQUEST,
  payload: id,
});

// Initial State
const initialState = {
  posts: [],
  currentPost: null,
  loading: false,
  detailsLoading: false,
  error: null,
};

// Reducer
const postsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_POSTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_POSTS_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: action.payload,
      };

    case FETCH_POSTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case FETCH_POST_DETAILS_REQUEST:
      return {
        ...state,
        detailsLoading: true,
        error: null,
      };

    case FETCH_POST_DETAILS_SUCCESS:
      return {
        ...state,
        detailsLoading: false,
        currentPost: action.payload,
      };

    case FETCH_POST_DETAILS_FAILURE:
      return {
        ...state,
        detailsLoading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default postsReducer;

/*
 * This file demonstrates:
 * 1. Setting up a reducer for use with Redux Saga
 * 2. Handling multiple loading states (list loading vs. details loading)
 * 3. Separating action creators from the reducer logic
 */
