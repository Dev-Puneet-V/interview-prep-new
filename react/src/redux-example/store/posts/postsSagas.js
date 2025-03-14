import { call, put, takeLatest, delay, all, select } from "redux-saga/effects";
import {
  FETCH_POSTS_REQUEST,
  FETCH_POST_DETAILS_REQUEST,
  FETCH_POSTS_SUCCESS,
  FETCH_POSTS_FAILURE,
  FETCH_POST_DETAILS_SUCCESS,
  FETCH_POST_DETAILS_FAILURE,
} from "./postsReducer";

// Simulated API calls
const fetchPostsFromAPI = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate API response
  return [
    {
      id: 1,
      title: "Introduction to Redux",
      body: "Redux is a predictable state container for JavaScript apps.",
    },
    {
      id: 2,
      title: "Redux Middleware",
      body: "Redux middleware provides a third-party extension point between dispatching an action and the moment it reaches the reducer.",
    },
    {
      id: 3,
      title: "Redux Saga",
      body: "Redux Saga is a library that aims to make application side effects easier to manage, more efficient to execute, and better at handling failures.",
    },
  ];
};

const fetchPostDetailsFromAPI = async (id) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulate API response
  const posts = {
    1: {
      id: 1,
      title: "Introduction to Redux",
      body: "Redux is a predictable state container for JavaScript apps. It helps you write applications that behave consistently, run in different environments (client, server, and native), and are easy to test.",
      author: "Dan Abramov",
      comments: [
        { id: 1, text: "Great article!", author: "User1" },
        { id: 2, text: "Very helpful, thanks!", author: "User2" },
      ],
    },
    2: {
      id: 2,
      title: "Redux Middleware",
      body: "Redux middleware provides a third-party extension point between dispatching an action and the moment it reaches the reducer. People use Redux middleware for logging, crash reporting, talking to an asynchronous API, routing, and more.",
      author: "Redux Team",
      comments: [{ id: 3, text: "Middleware is powerful!", author: "User3" }],
    },
    3: {
      id: 3,
      title: "Redux Saga",
      body: "Redux Saga is a library that aims to make application side effects (i.e. asynchronous things like data fetching and impure things like accessing the browser cache) easier to manage, more efficient to execute, simple to test, and better at handling failures.",
      author: "Saga Team",
      comments: [
        { id: 4, text: "Sagas are amazing for complex flows", author: "User4" },
        { id: 5, text: "I prefer this over thunks", author: "User5" },
      ],
    },
  };

  const post = posts[id];
  if (!post) {
    throw new Error("Post not found");
  }

  return post;
};

// Worker Sagas
function* fetchPostsSaga() {
  try {
    // Add a small delay to demonstrate loading state
    yield delay(1000);

    // Call the API
    const posts = yield call(fetchPostsFromAPI);

    // Dispatch success action
    yield put({ type: FETCH_POSTS_SUCCESS, payload: posts });
  } catch (error) {
    // Dispatch failure action
    yield put({ type: FETCH_POSTS_FAILURE, payload: error.message });
  }
}

function* fetchPostDetailsSaga(action) {
  try {
    const postId = action.payload;

    // Check if we already have this post in detail
    const currentPost = yield select((state) => state.posts.currentPost);
    if (currentPost && currentPost.id === postId) {
      // We already have this post, no need to fetch again
      return;
    }

    // Call the API
    const post = yield call(fetchPostDetailsFromAPI, postId);

    // Dispatch success action
    yield put({ type: FETCH_POST_DETAILS_SUCCESS, payload: post });
  } catch (error) {
    // Dispatch failure action
    yield put({ type: FETCH_POST_DETAILS_FAILURE, payload: error.message });
  }
}

// Watcher Sagas
function* watchFetchPosts() {
  yield takeLatest(FETCH_POSTS_REQUEST, fetchPostsSaga);
}

function* watchFetchPostDetails() {
  yield takeLatest(FETCH_POST_DETAILS_REQUEST, fetchPostDetailsSaga);
}

// Root Saga
export function* watchPostsSaga() {
  yield all([watchFetchPosts(), watchFetchPostDetails()]);
}

/*
 * This file demonstrates:
 * 1. Setting up Redux Saga for complex async flows
 * 2. Using various saga effects (call, put, takeLatest, delay, all, select)
 * 3. Handling API calls and error states
 * 4. Optimizing by checking if data is already loaded
 * 5. Combining multiple sagas with all effect
 */
