// import { useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import ProductCard from '../components/ProductCard';
// import Toast from '../components/Toast';
// import { getProductById, getRelatedProducts } from '../services/productService';
// import './ProductDetails.css';

// function ProductDetails() {
//   const { id } = useParams();
//   const product = getProductById(id);
//   const [quantity, setQuantity] = useState(1);
//   const [isWishlisted, setIsWishlisted] = useState(false);
//   const [showToast, setShowToast] = useState(false);

//   if (!product) {
//     return (
//       <div className="details-page">
//         <Navbar />
//         <div className="details-not-found">
//           <h2>Product not found</h2>
//           <p>The product you are looking for does not exist or was removed.</p>
//           <Link to="/products" className="back-link">Browse All Products</Link>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   const related = getRelatedProducts(product);

//   const decrease = () => setQuantity(q => (q > 1 ? q - 1 : 1));
//   const increase = () => setQuantity(q => (q < product.stock ? q + 1 : q));

//   return (
//     <div className="details-page">
//       <Navbar />

//       <div className="details-container">
//         <nav className="breadcrumb">
//           <Link to="/">Home</Link>
//           <span>/</span>
//           <Link to="/products">Products</Link>
//           <span>/</span>
//           <span className="current">{product.name}</span>
//         </nav>

//         <div className="details-grid">
//           <div className="details-image">
//             <img src={product.image} alt={product.name} />
//             {product.tag && <span className="details-tag">{product.tag}</span>}
//           </div>

//           <div className="details-info">
//             <div className="details-meta">
//               <span className="details-category">{product.category}</span>
//               <span className="details-stock">In Stock ({product.stock})</span>
//             </div>

//             <h1>{product.name}</h1>
//             <p className="details-store">Sold by <Link to="/stores">{product.store}</Link></p>

//             <div className="details-price">৳{product.price}</div>

//             <p className="details-description">{product.description}</p>

//             <div className="details-actions">
//               <div className="quantity-box">
//                 <button onClick={decrease} aria-label="Decrease quantity">−</button>
//                 <span>{quantity}</span>
//                 <button onClick={increase} aria-label="Increase quantity">+</button>
//               </div>

//               <button className="add-cart-btn" onClick={() => setShowToast(true)}>
//                 Add to Cart
//               </button>

//               <button
//                 className={`wish-btn ${isWishlisted ? 'active' : ''}`}
//                 onClick={() => setIsWishlisted(!isWishlisted)}
//                 aria-label="Toggle wishlist"
//               >
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? '#11120f' : 'none'} stroke="currentColor" strokeWidth="2">
//                   <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
//                 </svg>
//               </button>
//             </div>

//             <div className="details-extra">
//               <div><span>Delivery</span> Within 24–48 hours in your area</div>
//               <div><span>Payment</span> Cash on delivery available</div>
//             </div>
//           </div>
//         </div>

//         {related.length > 0 && (
//           <section className="related-section">
//             <h2>You may also like</h2>
//             <div className="related-grid">
//               {related.map(p => (
//                 <ProductCard key={p.id} product={p} />
//               ))}
//             </div>
//           </section>
//         )}
//       </div>

//       <Footer />

//       <Toast
//         show={showToast}
//         message={`Added ${quantity} x ${product.name} to cart`}
//         onHide={() => setShowToast(false)}
//       />
//     </div>
//   );
// }

// export default ProductDetails;

// import { useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import ProductCard from '../components/ProductCard';
// import Toast from '../components/Toast';
// import BookingButton from '../components/BookingButton';
// import { getProductById, getRelatedProducts } from '../services/productService';
// import './ProductDetails.css';

// function ProductDetails() {
//   const { id } = useParams();
//   const product = getProductById(id);
//   const [quantity, setQuantity] = useState(1);
//   const [isWishlisted, setIsWishlisted] = useState(false);
//   const [showToast, setShowToast] = useState(false);

//   if (!product) {
//     return (
//       <div className="details-page">
//         <Navbar />
//         <div className="details-not-found">
//           <h2>Product not found</h2>
//           <p>The product you are looking for does not exist or was removed.</p>
//           <Link to="/products" className="back-link">Browse All Products</Link>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   const related = getRelatedProducts(product);

//   const decrease = () => setQuantity(q => (q > 1 ? q - 1 : 1));
//   const increase = () => setQuantity(q => (q < product.stock ? q + 1 : q));

//   return (
//     <div className="details-page">
//       <Navbar />

//       <div className="details-container">
//         <nav className="breadcrumb">
//           <Link to="/">Home</Link>
//           <span>/</span>
//           <Link to="/products">Products</Link>
//           <span>/</span>
//           <span className="current">{product.name}</span>
//         </nav>

//         <div className="details-grid">
//           <div className="details-image">
//             <img src={product.image} alt={product.name} />
//             {product.tag && <span className="details-tag">{product.tag}</span>}
//           </div>

//           <div className="details-info">
//             <div className="details-meta">
//               <span className="details-category">{product.category}</span>
//               <span className="details-stock">In Stock ({product.stock})</span>
//             </div>

//             <h1>{product.name}</h1>
//             <p className="details-store">Sold by <Link to="/stores">{product.store}</Link></p>

//             <div className="details-price">৳{product.price}</div>

//             <p className="details-description">{product.description}</p>

//             {product.price > 5000 && (
//               <div className="reserve-note">
//                 Premium product — available for in-store reservation
//               </div>
//             )}

//             <div className="details-actions">
//               <div className="quantity-box">
//                 <button onClick={decrease} aria-label="Decrease quantity">−</button>
//                 <span>{quantity}</span>
//                 <button onClick={increase} aria-label="Increase quantity">+</button>
//               </div>

//               <button className="add-cart-btn" onClick={() => setShowToast(true)}>
//                 Add to Cart
//               </button>

//               {product.price > 5000 && (
//                 <BookingButton
//                   storeName={product.store}
//                   productName={product.name}
//                   className="details-reserve-btn"
//                 />
//               )}

//               <button
//                 className={`wish-btn ${isWishlisted ? 'active' : ''}`}
//                 onClick={() => setIsWishlisted(!isWishlisted)}
//                 aria-label="Toggle wishlist"
//               >
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? '#11120f' : 'none'} stroke="currentColor" strokeWidth="2">
//                   <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
//                 </svg>
//               </button>
//             </div>

//             <div className="details-extra">
//               <div><span>Delivery</span> Within 24–48 hours in your area</div>
//               <div><span>Payment</span> Cash on delivery available</div>
//             </div>
//           </div>
//         </div>

//         {related.length > 0 && (
//           <section className="related-section">
//             <h2>You may also like</h2>
//             <div className="related-grid">
//               {related.map(p => (
//                 <ProductCard key={p.id} product={p} />
//               ))}
//             </div>
//           </section>
//         )}
//       </div>

//       <Footer />

//       <Toast
//         show={showToast}
//         message={`Added ${quantity} x ${product.name} to cart`}
//         onHide={() => setShowToast(false)}
//       />
//     </div>
//   );
// }

// export default ProductDetails;
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Toast from '../components/Toast';
import BookingButton from '../components/BookingButton';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { getProductById, getRelatedProducts } from '../services/productService';
import './ProductDetails.css';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { wishlistProductIds, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    async function loadProduct() {
      try {
        setProduct(await getProductById(id));
      } catch (error) {
        console.error('Error loading product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="details-page">
        <Navbar />
        <div className="details-not-found">
          <h2>Product not found</h2>
          <p>The product you are looking for does not exist or was removed.</p>
          <Link to="/products" className="back-link">Browse All Products</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const related = getRelatedProducts(product);
  const productId = Number(product?.id || product?.product_id || product?._id);
  const storeId = Number(product?.store_id || product?.storeId) || null;

  const decrease = () => setQuantity(q => (q > 1 ? q - 1 : 1));
  const increase = () => setQuantity(q => (q < product.stock ? q + 1 : q));

  const handleAddToCart = async () => {
    try {
      await addToCart(product, quantity);
      setShowToast(true);
    } catch (error) {
      console.error('Unable to add product to cart:', error);
    }
  };

  const handleWishlistToggle = async () => {
    try {
      if (!localStorage.getItem('token')) {
        setToastMessage('Please login to use wishlist');
        setShowToast(true);
        return;
      }
      const saved = wishlistProductIds.includes(Number(product.id));
      await toggleWishlist(productId);
      setToastMessage(saved ? 'Removed from wishlist' : 'Added to wishlist');
      setShowToast(true);
    } catch (error) {
      console.error('Unable to update wishlist:', error);
      setToastMessage(error.response?.data?.message || 'Wishlist action failed');
      setShowToast(true);
    }
  };

  return (
    <div className="details-page">
      <Navbar />

      <div className="details-container">
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <span className="current">{product.name}</span>
        </nav>

        <div className="details-grid">
          <div className="details-image">
            <img src={product.image} alt={product.name} />
            {product.tag && <span className="details-tag">{product.tag}</span>}
          </div>

          <div className="details-info">
            <div className="details-meta">
              <span className="details-category">{product.category}</span>
              <span className="details-stock">In Stock ({product.stock})</span>
            </div>

            <h1>{product.name}</h1>
            <p className="details-store">Sold by <Link to="/stores">{product.store}</Link></p>

            <div className="details-price">৳{product.price}</div>

            <p className="details-description">{product.description}</p>

            {product.price > 5000 && (
              <div className="reserve-note">
                Premium product — available for in-store reservation
              </div>
            )}

            <div className="details-actions">
              <div className="quantity-box">
                <button onClick={decrease} aria-label="Decrease quantity">−</button>
                <span>{quantity}</span>
                <button onClick={increase} aria-label="Increase quantity">+</button>
              </div>

              <button className="add-cart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>

              {product.price > 5000 && (
                <BookingButton
                  storeName={product.store}
                  productName={product.name}
                    productId={productId}
                    storeId={storeId}
                  className="details-reserve-btn"
                />
              )}

              <button
                className={`wish-btn ${wishlistProductIds.includes(Number(product.id)) ? 'active' : ''}`}
                onClick={handleWishlistToggle}
                aria-label="Toggle wishlist"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlistProductIds.includes(Number(product.id)) ? '#11120f' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>

            <div className="details-extra">
              <div><span>Delivery</span> Within 24–48 hours in your area</div>
              <div><span>Payment</span> Cash on delivery available</div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="related-section">
            <h2>You may also like</h2>
            <div className="related-grid">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />

      <Toast
        show={showToast}
        message={toastMessage || `Added ${quantity} x ${product.name} to cart`}
        onHide={() => setShowToast(false)}
      />
    </div>
  );
}

export default ProductDetails;