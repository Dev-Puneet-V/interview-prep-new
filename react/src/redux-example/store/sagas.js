import { all } from "redux-saga/effects";
import { watchPostsSaga } from "./posts/postsSagas";

// Root saga that combines all sagas
export default function* rootSaga() {
  yield all([
    watchPostsSaga(),
    // Add other sagas here
  ]);
}

/*
 * This file demonstrates:
 * 1. How to create a root saga that combines all other sagas
 * 2. Using the all effect to run multiple sagas in parallel
 */
