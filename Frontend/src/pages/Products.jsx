import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/productService';
import { getStores } from '../services/storeService';
import './Products.css';

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const storeFilter = searchParams.get('store');
  const searchFilter = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchFilter);
  const [selectedCategory, setSelectedCategory] = useState(
  categoryFilter ? decodeURIComponent(categoryFilter) : 'all'
);

  const [sortBy, setSortBy] = useState('default');
  const [stores, setStores] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productList, storeList] = await Promise.all([getProducts(), getStores()]);
        setProducts(productList);
        setStores(storeList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    setSearchQuery(searchFilter);
  }, [searchFilter]);




  const categories = [
    'all',
    ...new Set(
      products.flatMap((product) => [
        ...(Array.isArray(product.category_names) ? product.category_names : []),
        product.category_name,
        product.category
      ]).filter(Boolean).map((category) => String(category).trim())
    )
  ];

  const filteredProducts = products
    .filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.store &&
          product.store.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' ||
        [
          ...(Array.isArray(product.category_names) ? product.category_names : []),
          product.category_name,
          product.category
        ].some((category) => String(category || '').trim().toLowerCase() === 
selectedCategory.toLowerCase());

      const matchesStore =
        !storeFilter || Number(product.store_id) === Number(storeFilter);

      return matchesSearch && matchesCategory && matchesStore;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);

      return 0;
    });

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="products-page">
      <Navbar />

      <div className="products-container">
        <div className="products-header">
          <h1>
            {storeFilter
              ? `Products from ${stores.find((store) => Number(store.store_id) === Number(storeFilter))?.store_name || storeFilter}`
              : 'All Products'}
          </h1>

          <p>
            Discover {filteredProducts.length} products from local stores
          </p>

          {storeFilter && (
            <button
              className="clear-store"
              onClick={() => setSearchParams({})}
            >
              ✕ Clear store filter
            </button>
          )}
        </div>

        <div className="products-filters">
          <div className="filter-group">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="default">Sort by: Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        <div className="products-count">
          Showing {filteredProducts.length} of {products.length} products
        </div>

        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-products">
            <p>No products found matching your criteria</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Products;

