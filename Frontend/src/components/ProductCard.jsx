import { useState } from 'react';
import { Link } from 'react-router-dom';
import Toast from './Toast';
import BookingButton from './BookingButton';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductCard.css';

function ProductCard({ product }) {
  const { addToCart, items } = useCart();
  const { wishlistProductIds, toggleWishlist } = useWishlist();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const productId = Number(product?.id || product?.product_id || product?._id);
  const storeId = Number(product?.store_id || product?.storeId) || null;
  const isSaved = wishlistProductIds.includes(productId);

  const cartQuantity = items.find((item) => item.id === product.id)?.quantity || 0;
  const availableStock = Number(product.stock || 0);
  const isOutOfStock = availableStock <= 0 || cartQuantity >= availableStock;

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (!localStorage.getItem('token')) {
        setToastMessage('Please login to use wishlist');
        setShowToast(true);
        return;
      }
      await toggleWishlist(productId);
      setToastMessage(isSaved ? 'Removed from wishlist' : 'Added to wishlist');
      setShowToast(true);
    } catch (error) {
      console.error('Wishlist toggle failed:', error);
      setToastMessage(error.response?.data?.message || 'Wishlist action failed');
      setShowToast(true);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      setToastMessage('This product is out of stock.');
      setShowToast(true);
      return;
    }

    try {
      await addToCart(product, 1);
      setToastMessage(`${product.name} added to cart`);
      setShowToast(true);
    } catch (error) {
      setToastMessage(error?.response?.data?.message || 'Unable to add product to cart');
      setShowToast(true);
    }
  };

  return (
    <>
      <Link to={`/products/${product.id}`} className="product-card">
        <div className="product-card-image">
          <img src={product.image} alt={product.name} />
          {product.tag && <span className="product-tag">{product.tag}</span>}
          <button
            className={`wishlist-btn ${isSaved ? 'active' : ''}`}
            onClick={handleWishlistToggle}
            aria-label="Add to wishlist"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={isSaved ? '#11120f' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
        <div className="product-card-content">
          <div className="product-meta">
            <span className="product-category">{product.category}</span>
            <span className="product-store">{product.store}</span>
          </div>
          <h3 className="product-name">{product.name}</h3>
          <div className="product-footer">
            <span className="product-price">৳{product.price}</span>
            <div className="product-actions">
              {product.price > 5000 && (
                <BookingButton
                  storeName={product.store}
                  productName={product.name}
                  storeId={storeId}
                  productId={productId}
                  onSuccess={(message) => {
                    setToastMessage(message || 'Item reserved successfully!');
                    setShowToast(true);
                  }}
                />
              )}
              <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={isOutOfStock}>
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </Link>
      <Toast
        show={showToast}
        message={toastMessage}
        onHide={() => setShowToast(false)}
      />
    </>
  );
}

export default ProductCard;