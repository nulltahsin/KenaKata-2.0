import { useState } from 'react';
import { createVendorStore, updateVendorStore } from '../services/storeService';

const emptyForm = { store_name: '', address: '', description: '', logo_url: '', category: '', market_id: '' };

function ShopOnboardingForm({ store, markets, onSaved, onCancel }) {
  const [form, setForm] = useState(store ? { ...emptyForm, ...store } : emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const categories = [...new Set(form.category.split(',').map((tag) => tag.trim()).filter(Boolean))];
      const payload = { ...form, category: categories.join(', '), categories, market_id: Number(form.market_id) };
      const saved = store ? await updateVendorStore(store.store_id, payload) : await createVendorStore(payload);
      onSaved(saved);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save shop details.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="vendor-panel">
      <div className="vendor-panel-heading">
        <div>
          <p className="vendor-eyebrow">{store ? 'Shop profile' : 'First step'}</p>
          <h2>{store ? 'Your shop details' : 'Set up your shop'}</h2>
          <p>{store ? 'Keep your storefront information current.' : 'Create a shop before adding products.'}</p>
        </div>
        {store && onCancel && <button type="button" className="vendor-secondary-button" onClick={onCancel}>Cancel</button>}
      </div>
      <form className="vendor-form" onSubmit={handleSubmit}>
        <label>Shop Name<input name="store_name" value={form.store_name} onChange={handleChange} placeholder="Example: Fresh Corner" required /></label>
        <label>Market<select name="market_id" value={form.market_id} onChange={handleChange} required><option value="">Select a market</option>{markets.map((market) => <option key={market.market_id} value={market.market_id}>{market.market_name}</option>)}</select></label>
        <label>Location<input name="address" value={form.address} onChange={handleChange} placeholder="Street, area, city" required /></label>
        <label>Category<input name="category" value={form.category} onChange={handleChange} placeholder="Grocery, fashion, electronics" required /></label>
        <label className="vendor-form-wide">Description<textarea name="description" value={form.description} onChange={handleChange} placeholder="Tell customers what makes your shop special" rows="3" /></label>
        <label className="vendor-form-wide">Logo URL<input type="url" name="logo_url" value={form.logo_url} onChange={handleChange} placeholder="https://example.com/logo.png" /></label>
        {error && <p className="vendor-error vendor-form-wide">{error}</p>}
        <button className="vendor-primary-button vendor-form-wide" disabled={saving}>{saving ? 'Saving...' : store ? 'Save shop details' : 'Create shop'}</button>
      </form>
    </section>
  );
}

export default ShopOnboardingForm;
