import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

function Home() {
  const [productList, setProductList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [marketList, setMarketList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [categoryResponse, marketResponse, productResponse] = await Promise.all([
          api.get("/api/categories"),
          api.get("/api/markets"),
          api.get("/api/products")
        ]);

        const categoryList = Array.isArray(categoryResponse.data) ? categoryResponse.data : [];
        const markets = Array.isArray(marketResponse.data) ? marketResponse.data : [];
        const products = Array.isArray(productResponse.data) ? productResponse.data : [];

        setCategories(categoryList);
        setMarketList(markets);
        setProductList(products);
      } catch (error) {
        console.error("Error loading home data:", error);
        setCategories([]);
        setMarketList([]);
        setProductList([]);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  const featuredMarket = {
    name: marketList[0]?.market_name || "Bashundhara City",
    location: marketList[0]?.location || "Dhaka, Bangladesh",
    stores: Math.max(1, marketList[0]?.store_count || marketList.length),
    products: productList.length,
  };

  const visibleCategories = categories.slice(0, 4);

  return (
    <div className="home-page">
      <Navbar />

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <p className="hero-eyebrow">YOUR LOCAL MARKETPLACE</p>

            <h1 className="hero-title">
              Everything you
              <br />
              need.
              <span>Right around you.</span>
            </h1>

            <p className="hero-description">
              Discover products, local stores and markets around your area — all in one beautifully simple marketplace.
            </p>

            <div className="hero-buttons">
              <a href="/products" className="primary-button">
                Explore Products
                <span>↗</span>
              </a>

              <a href="/markets" className="secondary-button">
                Discover Markets
              </a>
            </div>
          </div>

          <div className="market-card">
            <div className="market-image-container">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=85"
                alt={featuredMarket.name}
                className="market-image"
              />
            </div>

            <div className="market-details">
              <div className="market-main-info">
                <p className="market-label">FEATURED MARKET</p>
                <h2 className="market-name">{featuredMarket.name}</h2>
                <p className="market-location">{featuredMarket.location}</p>
              </div>

              <div className="market-meta">
                <div className="market-store-count">
                  <strong>{featuredMarket.stores}</strong>
                  <span>Stores</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <strong>{loading ? "..." : `${marketList.length}+`}</strong>
              <span>Local Stores</span>
            </div>

            <div className="stat-card">
              <strong>{loading ? "..." : `${productList.length}+`}</strong>
              <span>Products</span>
            </div>

            <div className="stat-card">
              <strong>{loading ? "..." : `${marketList.length}+`}</strong>
              <span>Markets</span>
            </div>

            <div className="stat-card">
              <strong>Dhaka</strong>
              <span>Currently exploring</span>
            </div>
          </div>
        </section>

        <section className="categories-section">
          <div className="section-heading">
            <div>
              <p className="section-eyebrow">EXPLORE</p>
              <h2>Shop by category</h2>
            </div>

            <a href="/products" className="view-all">View all ↗</a>
          </div>

          <div className="category-grid">
            {visibleCategories.length > 0 ? (
              visibleCategories.map((category) => (
                <Link
  key={category.category_id}
  to={`/products?category=${encodeURIComponent(category.category_name)}`}
  className="category-card"
>
                  <div className="category-icon grocery-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                  </div>

                  <div>
                    <h3>{category.category_name}</h3>
                    <p>{countProductsByCategory(category.category_name)} items</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="category-card empty-category-card">
                <p>No categories yet.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );

  function countProductsByCategory(name) {
    return productList.filter((product) => {
      const productCategory = product.category_name || product.category || "";
      return productCategory.toLowerCase() === name.toLowerCase();
    }).length;
  }
}

export default Home;