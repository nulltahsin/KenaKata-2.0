import { useState } from 'react';
import { createProduct, deleteProduct, updateProduct } from '../services/productService';

const emptyProduct = { name: '', description: '', image_url: '', category_names: [], price: '', stock_qty: '' };

function ProductManagement({ store, products, onProductsChange }) {
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const startEdit = (product) => {
    setEditingId(product.id);
    setForm({ name: product.name, description: product.description || '', image_url: product.image_url || product.image || '', category_names: product.category_names || [product.category_name || ''], price: product.price, stock_qty: product.stock_qty ?? product.stock });
    setError('');
  };
  const cancelEdit = () => { setEditingId(null); setForm(emptyProduct); };
  const shopCategories = [...new Set((Array.isArray(store.categories) ? store.categories : (store.category || '').split(','))
    .map((category) => category.trim())
    .filter(Boolean))];
  const handleCategoryChange = (event) => setForm({ ...form, category_names: [...event.target.selectedOptions].map((option) => option.value) });

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    const payload = { ...form, store_id: store.store_id, category_names: form.category_names, price: Number(form.price), stock_qty: Number(form.stock_qty) };
    try {
      const saved = editingId ? await updateProduct(editingId, payload) : await createProduct(payload);
      const savedProduct = { ...saved, id: saved.product_id || saved.id, category_names: saved.category_names || form.category_names };
      const next = editingId ? products.map((product) => product.id === editingId ? { ...product, ...savedProduct } : product) : [...products, savedProduct];
      onProductsChange(next);
      cancelEdit();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save product.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(productId) {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(productId);
      onProductsChange(products.filter((product) => product.id !== productId));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete product.');
    }
  }

  if (!store) return null;

  return (
    <section className="vendor-panel">
      <div className="vendor-panel-heading"><div><p className="vendor-eyebrow">Inventory</p><h2>Manage products</h2><p>Add, update, or remove products from {store.store_name}.</p></div><span className="vendor-count">{products.length} items</span></div>
      <form className="vendor-form vendor-product-form" onSubmit={handleSubmit}>
        <label>Product name<input name="name" value={form.name} onChange={handleChange} placeholder="Product name" required /></label>
        <label>Image URL<input type="url" name="image_url" value={form.image_url} onChange={handleChange} placeholder="https://example.com/product.jpg" /></label>
        <label className="vendor-form-wide">Description<textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe this product for customers" rows="3" /></label>
        <label>Categories<select className="vendor-category-select" name="category_names" multiple value={form.category_names} onChange={handleCategoryChange} required>{shopCategories.map((category) => <option key={category} value={category}>{category}</option>)}</select><small className="vendor-field-hint">Hold Ctrl or Command to select multiple.</small></label>
        <label>Price<input type="number" min="0" step="0.01" name="price" value={form.price} onChange={handleChange} required /></label>
        <label>Stock<input type="number" min="0" name="stock_qty" value={form.stock_qty} onChange={handleChange} required /></label>
        {error && <p className="vendor-error vendor-form-wide">{error}</p>}
        <div className="vendor-form-actions vendor-form-wide"><button className="vendor-primary-button" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update product' : 'Add product'}</button>{editingId && <button type="button" className="vendor-secondary-button" onClick={cancelEdit}>Cancel</button>}</div>
      </form>
      {products.length === 0 ? <div className="vendor-empty">No products yet. Add your first product above.</div> : <div className="product-table-wrap"><table className="product-table"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th /></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td>{product.name}</td><td>{product.category_name || product.category || 'Uncategorized'}</td><td>৳{Number(product.price).toFixed(2)}</td><td>{product.stock_qty ?? product.stock ?? 0}</td><td className="table-actions"><button type="button" onClick={() => startEdit(product)}>Edit</button><button type="button" onClick={() => handleDelete(product.id)}>Delete</button></td></tr>)}</tbody></table></div>}
    </section>
  );
}

export default ProductManagement;
