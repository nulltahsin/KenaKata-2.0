// import { useState } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import ProductCard from '../components/ProductCard';
// import './Products.css';

// function Products() {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const storeFilter = searchParams.get('store');

//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [sortBy, setSortBy] = useState('default');

//   const products = [
//     {
//       id: 1,
//       name: 'Premium Oversized Tee',
//       category: 'Fashion',
//       store: 'Urban Thread',
//       price: 1290,
//       image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
//       tag: 'TRENDING'
//     },
//     {
//       id: 2,
//       name: 'Wireless Headphones',
//       category: 'Electronics',
//       store: 'Tech Haven',
//       price: 3490,
//       image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
//       tag: 'POPULAR'
//     },
//     {
//       id: 3,
//       name: 'Organic Green Basket',
//       category: 'Grocery',
//       store: 'Fresh Corner',
//       price: 890,
//       image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
//       tag: 'FRESH'
//     },
//     {
//       id: 4,
//       name: 'Classic Leather Wallet',
//       category: 'Fashion',
//       store: 'The Leather Co.',
//       price: 1850,
//       image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500',
//       tag: 'NEW'
//     },
//     {
//       id: 5,
//       name: 'Ceramic Plant Pot',
//       category: 'Home & Living',
//       store: 'Green Space',
//       price: 650,
//       image: 'https://images.unsplash.com/photo-1485955900659-3561bde0c203?w=500',
//       tag: null
//     },
//     {
//       id: 6,
//       name: 'Smart Watch Pro',
//       category: 'Electronics',
//       store: 'Tech Haven',
//       price: 4990,
//       image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500',
//       tag: 'SALE'
//     },
//     {
//       id: 7,
//       name: 'Cotton Bedsheet Set',
//       category: 'Home & Living',
//       store: 'Home Essentials',
//       price: 2290,
//       image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500',
//       tag: null
//     },
//     {
//       id: 8,
//       name: 'Fresh Fruit Box',
//       category: 'Grocery',
//       store: 'Fresh Corner',
//       price: 590,
//       image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500',
//       tag: 'FRESH'
//     }
//   ];

//   const categories = ['all', 'Fashion', 'Electronics', 'Grocery', 'Home & Living'];

//   const filteredProducts = products
//     .filter(product => {
//       const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                            product.store.toLowerCase().includes(searchQuery.toLowerCase());
//       const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
//       const matchesStore = !storeFilter || product.store === storeFilter;
//       return matchesSearch && matchesCategory && matchesStore;
//     })
//     .sort((a, b) => {
//       if (sortBy === 'price-low') return a.price - b.price;
//       if (sortBy === 'price-high') return b.price - a.price;
//       if (sortBy === 'name') return a.name.localeCompare(b.name);
//       return 0;
//     });

//   return (
//     <div className="products-page">
//       <Navbar />
      
//       <div className="products-container">
//         <div className="products-header">
//           <h1>{storeFilter ? `Products from ${storeFilter}` : 'All Products'}</h1>
//           <p>Discover {filteredProducts.length} products from local stores</p>
//           {storeFilter && (
//             <button className="clear-store" onClick={() => setSearchParams({})}>
//               ✕ Clear store filter
//             </button>
//           )}
//         </div>

//         <div className="products-filters">
//           <div className="filter-group">
//             <input
//               type="text"
//               placeholder="Search products..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="search-input"
//             />
//           </div>

//           <div className="filter-group">
//             <select
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//               className="category-select"
//             >
//               {categories.map(cat => (
//                 <option key={cat} value={cat}>
//                   {cat === 'all' ? 'All Categories' : cat}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="filter-group">
//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//               className="sort-select"
//             >
//               <option value="default">Sort by: Default</option>
//               <option value="price-low">Price: Low to High</option>
//               <option value="price-high">Price: High to Low</option>
//               <option value="name">Name: A to Z</option>
//             </select>
//           </div>
//         </div>

//         <div className="products-count">
//           Showing {filteredProducts.length} of {products.length} products
//         </div>

//         <div className="products-grid">
//           {filteredProducts.map(product => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>

//         {filteredProducts.length === 0 && (
//           <div className="no-products">
//             <p>No products found matching your criteria</p>
//           </div>
//         )}
//       </div>

//       <Footer />
//     </div>
//   );
// }

// export default Products;




// import { useState } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import ProductCard from '../components/ProductCard';
// import './Products.css';

// function Products() {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const storeFilter = searchParams.get('store');

//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [sortBy, setSortBy] = useState('default');

//   const products = [
//     {
//       id: 1,
//       name: 'Premium Oversized Tee',
//       category: 'Fashion',
//       store: 'Urban Thread',
//       price: 1290,
//       image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
//       tag: 'TRENDING'
//     },
//     {
//       id: 2,
//       name: 'Wireless Headphones',
//       category: 'Electronics',
//       store: 'Tech Haven',
//       price: 3490,
//       image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
//       tag: 'POPULAR'
//     },
//     {
//       id: 3,
//       name: 'Organic Green Basket',
//       category: 'Grocery',
//       store: 'Fresh Corner',
//       price: 890,
//       image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
//       tag: 'FRESH'
//     },
//     {
//       id: 4,
//       name: 'Classic Leather Wallet',
//       category: 'Fashion',
//       store: 'The Leather Co.',
//       price: 1850,
//       image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500',
//       tag: 'NEW'
//     },
//     {
//       id: 5,
//       name: 'Ceramic Plant Pot',
//       category: 'Home & Living',
//       store: 'Green Space',
//       price: 650,
//       image: 'https://images.unsplash.com/photo-1485955900659-3561bde0c203?w=500',
//       tag: null
//     },
//     {
//       id: 6,
//       name: 'Smart Watch Pro',
//       category: 'Electronics',
//       store: 'Tech Haven',
//       price: 5490,
//       image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500',
//       tag: 'SALE'
//     },
//     {
//       id: 7,
//       name: 'Cotton Bedsheet Set',
//       category: 'Home & Living',
//       store: 'Home Essentials',
//       price: 2290,
//       image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500',
//       tag: null
//     },
//     {
//       id: 8,
//       name: 'Fresh Fruit Box',
//       category: 'Grocery',
//       store: 'Fresh Corner',
//       price: 590,
//       image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500',
//       tag: 'FRESH'
//     },
//     {
//       id: 9,
//       name: '4K Action Camera',
//       category: 'Electronics',
//       store: 'Tech Haven',
//       price: 6990,
//       image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99b?w=500',
//       tag: 'NEW'
//     },
//     {
//       id: 10,
//       name: 'Gaming Console X',
//       category: 'Electronics',
//       store: 'Tech Haven',
//       price: 8990,
//       image: 'https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?w=500',
//       tag: null
//     }
//   ];

//   const categories = ['all', 'Fashion', 'Electronics', 'Grocery', 'Home & Living'];

//   const filteredProducts = products
//     .filter(product => {
//       const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                            product.store.toLowerCase().includes(searchQuery.toLowerCase());
//       const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
//       const matchesStore = !storeFilter || product.store === storeFilter;
//       return matchesSearch && matchesCategory && matchesStore;
//     })
//     .sort((a, b) => {
//       if (sortBy === 'price-low') return a.price - b.price;
//       if (sortBy === 'price-high') return b.price - a.price;
//       if (sortBy === 'name') return a.name.localeCompare(b.name);
//       return 0;
//     });

//   return (
//     <div className="products-page">
//       <Navbar />
      
//       <div className="products-container">
//         <div className="products-header">
//           <h1>{storeFilter ? `Products from ${storeFilter}` : 'All Products'}</h1>
//           <p>Discover {filteredProducts.length} products from local stores</p>
//           {storeFilter && (
//             <button className="clear-store" onClick={() => setSearchParams({})}>
//               ✕ Clear store filter
//             </button>
//           )}
//         </div>

//         <div className="products-filters">
//           <div className="filter-group">
//             <input
//               type="text"
//               placeholder="Search products..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="search-input"
//             />
//           </div>

//           <div className="filter-group">
//             <select
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//               className="category-select"
//             >
//               {categories.map(cat => (
//                 <option key={cat} value={cat}>
//                   {cat === 'all' ? 'All Categories' : cat}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="filter-group">
//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//               className="sort-select"
//             >
//               <option value="default">Sort by: Default</option>
//               <option value="price-low">Price: Low to High</option>
//               <option value="price-high">Price: High to Low</option>
//               <option value="name">Name: A to Z</option>
//             </select>
//           </div>
//         </div>

//         <div className="products-count">
//           Showing {filteredProducts.length} of {products.length} products
//         </div>

//         <div className="products-grid">
//           {filteredProducts.map(product => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>

//         {filteredProducts.length === 0 && (
//           <div className="no-products">
//             <p>No products found matching your criteria</p>
//           </div>
//         )}
//       </div>

//       <Footer />
//     </div>
//   );
// }

// export default Products;






import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/productService';
import { getStores } from '../services/storeService';
import './Products.css';

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const storeFilter = searchParams.get('store');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
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

  const categories = [
    'all',
    'Fashion',
    'Electronics',
    'Grocery',
    'Home & Living'
  ];

  const filteredProducts = products
    .filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.store &&
          product.store.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' ||
        product.category === selectedCategory;

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

