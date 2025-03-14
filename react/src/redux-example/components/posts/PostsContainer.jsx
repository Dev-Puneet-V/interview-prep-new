import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts, fetchPostDetails } from "../../store/posts/postsReducer";

const PostsContainer = () => {
  const { posts, currentPost, loading, detailsLoading, error } = useSelector(
    (state) => state.posts
  );
  const dispatch = useDispatch();
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleViewDetails = (id) => {
    setSelectedPostId(id);
    dispatch(fetchPostDetails(id));
  };

  if (error) {
    return <div className="alert alert-error">Error: {error}</div>;
  }

  return (
    <div className="card">
      <h2 className="section-title">Redux Saga Example: Posts</h2>

      <div className="explanation">
        <p>This example demonstrates Redux Saga for complex async flows:</p>
        <ul>
          <li>Managing complex async operations</li>
          <li>Handling multiple loading states</li>
          <li>Optimizing API calls (checking if data is already loaded)</li>
          <li>
            Using various saga effects (call, put, takeLatest, delay, select)
          </li>
        </ul>
      </div>

      <div className="row" style={{ display: "flex", gap: "20px" }}>
        <div className="col" style={{ flex: 1 }}>
          <h3>Posts List</h3>

          {loading ? (
            <div className="loading">Loading posts...</div>
          ) : (
            <div>
              {posts.map((post) => (
                <div key={post.id} className="post-card">
                  <h4 className="post-title">{post.title}</h4>
                  <p className="post-body">{post.body}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleViewDetails(post.id)}
                    disabled={detailsLoading && selectedPostId === post.id}
                  >
                    {detailsLoading && selectedPostId === post.id
                      ? "Loading..."
                      : "View Details"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col" style={{ flex: 1 }}>
          <h3>Post Details</h3>

          {detailsLoading ? (
            <div className="loading">Loading details...</div>
          ) : currentPost ? (
            <div className="post-card">
              <h4 className="post-title">{currentPost.title}</h4>
              <p>
                <strong>Author:</strong> {currentPost.author}
              </p>
              <p className="post-body">{currentPost.body}</p>

              <h5>Comments</h5>
              {currentPost.comments.map((comment) => (
                <div
                  key={comment.id}
                  style={{
                    marginBottom: "10px",
                    padding: "10px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "5px",
                  }}
                >
                  <p>
                    <strong>{comment.author}:</strong> {comment.text}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div>Select a post to view details</div>
          )}
        </div>
      </div>

      <div className="code-block">
        <pre>{`
// Redux Saga example
function* fetchPostDetailsSaga(action) {
  try {
    const postId = action.payload;
    
    // Check if we already have this post in detail
    const currentPost = yield select(state => state.posts.currentPost);
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

// Watcher Saga
function* watchFetchPostDetails() {
  yield takeLatest(FETCH_POST_DETAILS_REQUEST, fetchPostDetailsSaga);
}
        `}</pre>
      </div>
    </div>
  );
};

export default PostsContainer;
