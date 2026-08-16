import { useEffect, useState } from "react";
import "./App.css";
 
const API_URL = "https://jsonplaceholder.typicode.com";
 
function App() {
  // =====================================================
  // Users
  // =====================================================
 
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");
 
  // =====================================================
  // Search + sort
  // =====================================================
 
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
 
  // =====================================================
  // Selected user
  // =====================================================
 
  const [selectedUser, setSelectedUser] = useState(null);
 
  // =====================================================
  // Posts
  // =====================================================
 
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState("");
 
  // =====================================================
  // Todos
  // =====================================================
 
  const [todos, setTodos] = useState([]);
  const [todosLoading, setTodosLoading] = useState(false);
  const [todosError, setTodosError] = useState("");
 
  // =====================================================
  // Fetch all users
  // =====================================================
 
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        setUsersError("");
 
        const response = await fetch(`${API_URL}/users`);
 
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
 
        const data = await response.json();
 
        setUsers(data);
      } catch (error) {
        setUsersError(error.message);
      } finally {
        setUsersLoading(false);
      }
    };
 
    fetchUsers();
  }, []);
 
  // =====================================================
  // Filter users
  // =====================================================
 
  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();
 
    return (
      user.name.toLowerCase().includes(searchText) ||
      user.company.name.toLowerCase().includes(searchText)
    );
  });
 
  // =====================================================
  // Sort users
  // =====================================================
 
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
 
    return a.company.name.localeCompare(b.company.name);
  });
 
  // =====================================================
  // Fetch posts + todos for selected user
  // =====================================================
 
  useEffect(() => {
    if (!selectedUser) {
      return;
    }
 
    let ignore = false;
 
    const fetchUserData = async () => {
      setPostsLoading(true);
      setTodosLoading(true);
 
      setPostsError("");
      setTodosError("");
 
      setPosts([]);
      setTodos([]);
 
      try {
        const [postsResponse, todosResponse] =
          await Promise.all([
            fetch(
              `${API_URL}/posts?userId=${selectedUser.id}`
            ),
            fetch(
              `${API_URL}/todos?userId=${selectedUser.id}`
            ),
          ]);
 
        if (!postsResponse.ok) {
          throw new Error("Failed to fetch posts");
        }
 
        if (!todosResponse.ok) {
          throw new Error("Failed to fetch todos");
        }
 
        const postsData = await postsResponse.json();
        const todosData = await todosResponse.json();
 
        // IMPORTANT:
        // Only update state if this is still
        // the currently selected user.
        if (!ignore) {
          setPosts(postsData);
          setTodos(todosData);
        }
      } catch (error) {
        if (!ignore) {
          setPostsError(error.message);
          setTodosError(error.message);
        }
      } finally {
        if (!ignore) {
          setPostsLoading(false);
          setTodosLoading(false);
        }
      }
    };
 
    fetchUserData();
 
    // =================================================
    // Cleanup
    // =================================================
 
    return () => {
      ignore = true;
    };
  }, [selectedUser]);
 
  // =====================================================
  // Select user
  // =====================================================
 
  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };
 
  // =====================================================
  // Close details
  // =====================================================
 
  const handleCloseDetails = () => {
    setSelectedUser(null);
    setPosts([]);
    setTodos([]);
    setPostsError("");
    setTodosError("");
  };
 
  // =====================================================
  // Todo statistics
  // =====================================================
 
  const completedTodos = todos.filter(
    (todo) => todo.completed
  ).length;
 
  const pendingTodos = todos.filter(
    (todo) => !todo.completed
  ).length;
 
  const completionPercentage =
    todos.length > 0
      ? Math.round(
          (completedTodos / todos.length) * 100
        )
      : 0;
 
  // =====================================================
  // Loading users
  // =====================================================
 
  if (usersLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading team directory...</p>
      </div>
    );
  }
 
  // =====================================================
  // Main UI
  // =====================================================
 
  return (
    <div className="app">
      {/* ===============================================
          Header
          =============================================== */}
 
      <header className="header">
        <div>
          <p className="eyebrow">JSONPlaceholder</p>
 
          <h1>Team Directory</h1>
 
          <p className="subtitle">
            Find a teammate and explore their posts
            and tasks.
          </p>
        </div>
 
        <div className="team-count">
          <strong>{users.length}</strong>
          <span>Team members</span>
        </div>
      </header>
 
      {/* ===============================================
          User error
          =============================================== */}
 
      {usersError && (
        <div className="error-box">
          <strong>Unable to load team</strong>
          <p>{usersError}</p>
        </div>
      )}
 
      {!usersError && (
        <>
          {/* ===========================================
              Controls
              =========================================== */}
 
          <section className="controls">
            <div className="search-wrapper">
              <span className="search-icon">⌕</span>
 
              <input
                type="text"
                className="search-input"
                placeholder="Search by name or company..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
 
              {search && (
                <button
                  className="clear-search"
                  onClick={() => setSearch("")}
                >
                  ×
                </button>
              )}
            </div>
 
            <div className="sort-wrapper">
              <label htmlFor="sort">
                Sort by
              </label>
 
              <select
                id="sort"
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value)
                }
              >
                <option value="name">
                  Name
                </option>
 
                <option value="company">
                  Company
                </option>
              </select>
            </div>
          </section>
 
          {/* ===========================================
              Results count
              =========================================== */}
 
          <div className="results-header">
            <p>
              Showing{" "}
              <strong>{sortedUsers.length}</strong>{" "}
              of <strong>{users.length}</strong> people
            </p>
          </div>
 
          {/* ===========================================
              No results
              =========================================== */}
 
          {sortedUsers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">⌕</div>
 
              <h2>No teammates found</h2>
 
              <p>
                Try a different name or company.
              </p>
 
              <button
                onClick={() => setSearch("")}
              >
                Clear search
              </button>
            </div>
          ) : (
            /* =========================================
               User grid
               ========================================= */
 
            <section className="user-grid">
              {sortedUsers.map((user) => (
                <article
                  className="user-card"
                  key={user.id}
                >
                  <div className="avatar">
                    {user.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
 
                  <span className="user-id">
                    USER #{String(user.id).padStart(2, "0")}
                  </span>
 
                  <h2>{user.name}</h2>
 
                  <p className="company">
                    {user.company.name}
                  </p>
 
                  <div className="user-details">
                    <p>
                      <span>✉</span>
                      {user.email}
                    </p>
 
                    <p>
                      <span>⌖</span>
                      {user.address.city}
                    </p>
                  </div>
 
                  <button
                    className="view-user-button"
                    onClick={() =>
                      handleSelectUser(user)
                    }
                  >
                    View profile
                    <span>→</span>
                  </button>
                </article>
              ))}
            </section>
          )}
        </>
      )}
 
      {/* =================================================
          User Detail Panel
          ================================================= */}
 
      {selectedUser && (
        <div
          className="panel-overlay"
          onClick={handleCloseDetails}
        >
          <aside
            className="detail-panel"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            
JSONPlaceholder - Free Fake REST API
 
{/* =========================================
                Panel Header
                ========================================= */}
 
            <div className="panel-header">
              <div className="profile-heading">
                <div className="large-avatar">
                  {selectedUser.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
 
                <div>
                  <span className="user-id">
                    USER #{String(selectedUser.id).padStart(
                      2,
                      "0"
                    )}
                  </span>
 
                  <h2>{selectedUser.name}</h2>
 
                  <p>
                    {selectedUser.company.name}
                  </p>
                </div>
              </div>
 
              <button
                className="close-button"
                onClick={handleCloseDetails}
              >
                ×
              </button>
            </div>
 
            {/* =========================================
                Contact Information
                ========================================= */}
 
            <section className="profile-info">
              <div>
                <span>Email</span>
                <strong>
                  {selectedUser.email}
                </strong>
              </div>
 
              <div>
                <span>Phone</span>
                <strong>
                  {selectedUser.phone}
                </strong>
              </div>
 
              <div>
                <span>Website</span>
                <strong>
                  {selectedUser.website}
                </strong>
              </div>
 
              <div>
                <span>City</span>
                <strong>
                  {selectedUser.address.city}
                </strong>
              </div>
            </section>
 
            {/* =========================================
                Posts
                ========================================= */}
 
            <section className="panel-section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">
                    Activity
                  </p>
 
                  <h3>Posts</h3>
                </div>
 
                {!postsLoading &&
                  !postsError && (
                    <span className="count-badge">
                      {posts.length}
                    </span>
                  )}
              </div>
 
              {postsLoading && (
                <div className="section-loading">
                  <div className="spinner small"></div>
                  <p>Loading posts...</p>
                </div>
              )}
 
              {postsError && (
                <div className="error-box">
                  <strong>
                    Posts error
                  </strong>
                  <p>{postsError}</p>
                </div>
              )}
 
              {!postsLoading &&
                !postsError &&
                posts.map((post) => (
                  <article
                    className="post-item"
                    key={post.id}
                  >
                    <span>
                      #{post.id}
                    </span>
 
                    <h4>{post.title}</h4>
 
                    <p>{post.body}</p>
                  </article>
                ))}
            </section>
 
            {/* =========================================
                Todos
                ========================================= */}
 
            <section className="panel-section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">
                    Work
                  </p>
 
                  <h3>Todos</h3>
                </div>
 
                {!todosLoading &&
                  !todosError && (
                    <span className="count-badge">
                      {todos.length}
                    </span>
                  )}
              </div>
 
              {todosLoading && (
                <div className="section-loading">
                  <div className="spinner small"></div>
                  <p>Loading todos...</p>
                </div>
              )}
 
              {todosError && (
                <div className="error-box">
                  <strong>
                    Todos error
                  </strong>
                  <p>{todosError}</p>
                </div>
              )}
 
              {!todosLoading &&
                !todosError && (
                  <>
                    {/* Todo stats */}
                    <div className="todo-stats">
                      <div className="stat">
                        <strong>
                          {completedTodos}
                        </strong>
 
                        <span>Completed</span>
                      </div>
 
                      <div className="stat">
                        <strong>
                          {pendingTodos}
                        </strong>
 
                        <span>Pending</span>
                      </div>
 
                      <div className="stat highlight">
                        <strong>
                          {completionPercentage}%
                        </strong>
 
                        <span>Complete</span>
                      </div>
                    </div>
 
                    {/* Todo progress */}
                    <div className="progress-wrapper">
                      <div className="progress-label">
                        <span>
                          Completion
                        </span>
 
                        <strong>
                          {completionPercentage}%
                        </strong>
                      </div>
 
                      <div className="progress-bar">
                        <div
                          className="progress"
                          style={{
                            width: `${completionPercentage}%`,
                          }}
                        ></div>
                      </div>
                    </div>
 
                    {/* Todo list */}
                    <div className="todo-list">
                      {todos.map((todo) => (
                        <div
                          className={`todo-item ${
                            todo.completed
                              ? "completed"
                              : ""
                          }`}
                          key={todo.id}
                        >
                          <span className="todo-status">
                            {todo.completed
                              ? "✓"
                              : "○"}
                          </span>
 
                          <span>
                            {todo.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}
 
export default App;
 