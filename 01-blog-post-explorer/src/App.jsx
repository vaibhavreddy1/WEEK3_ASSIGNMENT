import { useEffect, useState } from "react";
import "./App.css";
 
const API_URL = "https://jsonplaceholder.typicode.com";
 
function App() {
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 
 
  const [search, setSearch] = useState("");
 
  const [selectedPost, setSelectedPost] = useState(null);
 

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError("");
 
        const response = await fetch(`${API_URL}/posts`);
 
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
 
        const data = await response.json();
 
        setPosts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
 
    fetchPosts();
  }, []);
 
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );
 
  useEffect(() => {
    if (!selectedPost) {
      return;
    }
 
    const fetchComments = async () => {
      try {
        setCommentsLoading(true);
        setCommentsError("");
        setComments([]);
 
        const response = await fetch(
          `${API_URL}/posts/${selectedPost.id}/comments`
        );
 
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
 
        const data = await response.json();
 
        setComments(data);
      } catch (error) {
        setCommentsError(error.message);
      } finally {
        setCommentsLoading(false);
      }
    };
 
    fetchComments();
  }, [selectedPost]);
 
  
  const handlePostClick = (post) => {
    setSelectedPost(post);
  };
 

  const handleClose = () => {
    setSelectedPost(null);
    setComments([]);
    setCommentsError("");
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading posts...</p>
        </div>
      </div>
    );
  }
 
  return (
    <div className="app">
      
      <header className="header">
        <div>
          <p className="eyebrow">JSONPlaceholder</p>
 
          <h1>Blog Post Explorer</h1>
 
          <p className="subtitle">
            Explore posts, search by title, and view comments.
          </p>
        </div>
 
        <div className="post-count">
          <strong>{posts.length}</strong>
          <span>Total Posts</span>
        </div>
      </header>
 
      
      {error && (
        <div className="error-box">
          <strong>Error</strong>
          <p>{error}</p>
        </div>
      )}
 
      
      {!error && (
        <>
          <section className="search-section">
            <div className="search-wrapper">
              <span className="search-icon">⌕</span>
 
              <input
                className="search-input"
                type="text"
                placeholder="Search posts by title..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
 
              {search && (
                <button
                  className="clear-search"
                  onClick={() => setSearch("")}
                  type="button"
                >
                  ×
                </button>
              )}
            </div>
 
            <p className="results-count">
              Showing <strong>{filteredPosts.length}</strong> of{" "}
              <strong>{posts.length}</strong> posts
            </p>
          </section>
 
          
          {filteredPosts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">⌕</div>
 
              <h2>No posts found</h2>
 
              <p>
                No posts match <strong>"{search}"</strong>.
              </p>
 
              <button
                className="primary-button"
                onClick={() => setSearch("")}
              >
                Clear search
              </button>
            </div>
          ) : (
            
            <section className="post-grid">
              {filteredPosts.map((post) => (
                <article className="post-card" key={post.id}>
                  <div className="post-card-header">
                    <span className="post-number">
                      POST #{String(post.id).padStart(2, "0")}
                    </span>
 
                    <span className="arrow">↗</span>
                  </div>
 
                  <h2>{post.title}</h2>
 
                  <p className="post-preview">{post.body}</p>
 
                  <button
                    className="view-button"
                    onClick={() => handlePostClick(post)}
                  >
                    View comments
                    <span>→</span>
                  </button>
                </article>
              ))}
            </section>
          )}
        </>
      )}
 
     
      {selectedPost && (
        <div className="modal-overlay" onClick={handleClose}>
          <div
            className="modal"
            onClick={(event) => event.stopPropagation()}
          >
            
            <div className="modal-header">
              <div>
                <span className="post-number">
                  POST #{String(selectedPost.id).padStart(2, "0")}
                </span>
 
                <h2>{selectedPost.title}</h2>
              </div>
 
              <button
                className="close-button"
                onClick={handleClose}
                aria-label="Close"
              >
                ×
              </button>
            </div>
 
           
            <div className="modal-post-body">
              <p>{selectedPost.body}</p>
            </div>
 
            
            <div className="comments-section">
              <div className="comments-heading">
                <h3>Comments</h3>
 
                {!commentsLoading && !commentsError && (
                  <span>{comments.length}</span>
                )}
              </div>
 
              
              {commentsLoading && (
                <div className="comments-loading">
                  <div className="spinner small"></div>
 
                  <p>Loading comments...</p>
                </div>
              )}
 
             
              {commentsError && (
                <div className="error-box">
                  <strong>Error</strong>
                  <p>{commentsError}</p>
                </div>
              )}
 
              
              {!commentsLoading &&
                !commentsError &&
                comments.map((comment) => (
                  <article className="comment" key={comment.id}>
                    <div className="comment-header">
                      <span className="comment-number">
                        #{comment.id}
                      </span>
 
                      <span className="comment-email">
                        {comment.email}
                      </span>
                    </div>
 
                    <h4>{comment.name}</h4>
 
                    <p>{comment.body}</p>
                  </article>
                ))}
            </div>
 
            
            <div className="modal-footer">
              <button className="close-modal-button" onClick={handleClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 
export default App;

 