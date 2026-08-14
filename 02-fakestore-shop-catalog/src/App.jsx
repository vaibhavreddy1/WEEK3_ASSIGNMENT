import { useEffect, useMemo, useState } from "react";
import "./App.css";
 
const API_URL = "https://fakestoreapi.com";
 
function App() {
  // -----------------------------
  // Product state
  // -----------------------------
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
 
  // -----------------------------
  // UI state
  // -----------------------------
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
 
  // -----------------------------
  // Loading / error
  // -----------------------------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 
  // -----------------------------
  // Cart state
  // -----------------------------
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
 
  // =====================================================
  // Fetch products + categories
  // =====================================================
 
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setLoading(true);
        setError("");
 
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch(`${API_URL}/products`),
          fetch(`${API_URL}/products/categories`),
        ]);
 
        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error("Failed to fetch shop data");
        }
 
        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();
 
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
 
    fetchShopData();
  }, []);
 
  // =====================================================
  // Filter + sort products
  // =====================================================
 
  const displayedProducts = useMemo(() => {
    let result = [...products];
 
    // Filter
    if (category !== "all") {
      result = result.filter(
        (product) => product.category === category
      );
    }
 
    // Sort
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }
 
    if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }
 
    if (sortBy === "rating") {
      result.sort(
        (a, b) => b.rating.rate - a.rating.rate
      );
    }
 
    return result;
  }, [products, category, sortBy]);
 
  // =====================================================
  // Add to cart
  // =====================================================
 
  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === product.id
      );
 
      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }
 
      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };
 
  // =====================================================
  // Increase quantity
  // =====================================================
 
  const increaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };
 
  // =====================================================
  // Decrease quantity
  // =====================================================
 
  const decreaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };
 
  // =====================================================
  // Remove item
  // =====================================================
 
  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );
  };
 
  // =====================================================
  // Cart calculations using reduce()
  // =====================================================
 
  const cartItemCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );
 
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
 
  // =====================================================
  // Loading state
  // =====================================================
 
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading shop...</p>
      </div>
    );
  }
 
  // =====================================================
  // Main UI
  // =====================================================
 
  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div>
          <p className="eyebrow">FakeStore API</p>
 
          <h1>Shop Catalog</h1>
 
          <p className="subtitle">
            Browse products, filter categories, sort prices,
            and build your cart.
          </p>
        </div>
 
        <button
          className="cart-button"
          onClick={() => setCartOpen(true)}
        >
          <span className="cart-icon">🛒</span>
 
          <span>Cart</span>
 
          <span className="cart-count">
            {cartItemCount}
          </span>
        </button>
      </header>
 
      {/* Error */}
      {error && (
        <div className="error-box">
          <strong>Something went wrong</strong>
          <p>{error}</p>
        </div>
      )}
 
      {!error && (
        <>
          {/* Controls */}
          <section className="controls">
            <div className="control-group">
              <label htmlFor="category">
                Category
              </label>
 
              <select
                id="category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
              >
                <option value="all">All categories</option>
 
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
 
            <div className="control-group">
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
                <option value="default">
                  Default
                </option>
 
                <option value="price-low">
                  Price: Low → High
                </option>
 
                <option value="price-high">
                  Price: High → Low
                </option>
 
                <option value="rating">
                  Rating
                </option>
              </select>
            </div>
          </section>
 
          {/* Results */}
          <div className="results-header">
            <p>
              Showing{" "}
              <strong>{displayedProducts.length}</strong>{" "}
              products
            </p>
 
            {category !== "all" && (
              <button
                className="clear-filter"
                onClick={() => setCategory("all")}
              >
                Clear filter ×
              </button>
            )}
          </div>
 
          {/* Product Grid */}
          {displayedProducts.length === 0 ? (
            <div className="empty-state">
              <h2>No products found</h2>
 
              <p>
                There are no products in this category.
              </p>
 
              <button
                onClick={() => setCategory("all")}
              >
                Show all products
              </button>
            </div>
          ) : (
            <section className="product-grid">
              {displayedProducts.map((product) => (
                <article
                  className="product-card"
                  key={product.id}
                >
                  <div className="product-image-wrapper">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="product-image"
                    />
                  </div>
 
                  <div className="product-content">
                    <span className="product-category">
                      {product.category}
                    </span>
 
                    <h2>{product.title}</h2>
 
                    <div className="rating">
                      <span>★</span>
 
                      <strong>
                        {product.rating.rate}
                      </strong>
 
                      <small>
                        ({product.rating.count} reviews)
                      </small>
                    </div>
 
                    <div className="product-footer">
                      <strong className="price">
                        ${product.price.toFixed(2)}
                      </strong>
 
                      <button
                        className="add-button"
                        onClick={() =>
                          addToCart(product)
                        }
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}
        </>
      )}
 
      {/* =================================================
          Cart Drawer
          ================================================= */}
      {cartOpen && (
        <div
          className="drawer-overlay"
          onClick={() => setCartOpen(false)}
        >
          <aside
            className="cart-drawer"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="drawer-header">
              <div>
                <p className="eyebrow">Your selection</p>
                <h2>Your Cart</h2>
              </div>
 
              <button
                className="close-button"
                onClick={() => setCartOpen(false)}
              >
                ×
              </button>
            </div>
 
            {/* Empty cart */}
            {cart.length === 0 ? (
              <div className="empty-cart">
                <div>🛒</div>
 
                <h3>Your cart is empty</h3>
 
                <p>
                  Add some products to get started.
                </p>
 
                <button
                  onClick={() =>
                    setCartOpen(false)
                  }
                >
                   
              
                  Continue shopping
                </button>
              </div>
            ) : (
              <>
                {/* Cart items */}
                <div className="cart-items">
                  {cart.map((item) => (
                    <article
                      className="cart-item"
                      key={item.id}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                      />
 
                      <div className="cart-item-info">
                        <h3>{item.title}</h3>
 
                        <strong>
                          $
                          {item.price.toFixed(2)}
                        </strong>
 
                        <div className="quantity-controls">
                          <button
                            onClick={() =>
                              decreaseQuantity(
                                item.id
                              )
                            }
                          >
                            −
                          </button>
 
                          <span>
                            {item.quantity}
                          </span>
 
                          <button
                            onClick={() =>
                              increaseQuantity(
                                item.id
                              )
                            }
                          >
                            +
                          </button>
                        </div>
 
                        <button
                          className="remove-button"
                          onClick={() =>
                            removeFromCart(
                              item.id
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
 
                {/* Cart total */}
                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Items</span>
 
                    <strong>
                      {cartItemCount}
                    </strong>
                  </div>
 
                  <div className="summary-row total">
                    <span>Total</span>
 
                    <strong>
                      ${cartTotal.toFixed(2)}
                    </strong>
                  </div>
 
                  <button className="checkout-button">
                    Checkout
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
 
export default App;
 
      
 