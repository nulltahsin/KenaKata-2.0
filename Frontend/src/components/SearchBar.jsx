import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../services/productService';
import { getMarkets, getStores } from '../services/storeService';

function SearchBar() {
	const navigate = useNavigate();
	const containerRef = useRef(null);
	const [query, setQuery] = useState('');
	const [items, setItems] = useState([]);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		let active = true;

		async function loadSearchData() {
			try {
				const [products, stores, markets] = await Promise.all([
					getProducts(),
					getStores(),
					getMarkets()
				]);

				if (active) {
					setItems([
						...products.map((product) => ({
							type: 'Product',
							name: product.name,
							detail: product.store,
							path: `/products/${product.id}`
						})),
						...stores.map((store) => ({
							type: 'Store',
							name: store.store_name,
							detail: store.address,
							path: `/products?store=${store.store_id}`
						})),
						...markets.map((market) => ({
							type: 'Market',
							name: market.market_name,
							detail: market.location,
							path: `/stores?market=${market.market_id}`
						}))
					]);
				}
			} catch (error) {
				console.error('Unable to load search data:', error);
			}
		}

		loadSearchData();

		return () => {
			active = false;
		};
	}, []);

	useEffect(() => {
		function closeSuggestions(event) {
			if (!containerRef.current?.contains(event.target)) {
				setOpen(false);
			}
		}

		document.addEventListener('mousedown', closeSuggestions);
		return () => document.removeEventListener('mousedown', closeSuggestions);
	}, []);

	const suggestions = query.trim()
		? items.filter((item) => `${item.name} ${item.detail || ''}`.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 8)
		: [];

	const handleSubmit = (event) => {
		event.preventDefault();
		if (!query.trim()) return;
		setOpen(false);
		navigate(`/products?search=${encodeURIComponent(query.trim())}`);
	};

	const handleSelect = (item) => {
		setQuery('');
		setOpen(false);
		navigate(item.path);
	};

	return (
		<div className="navbar-search" ref={containerRef}>
			<form onSubmit={handleSubmit}>
				<input
					value={query}
					onChange={(event) => {
						setQuery(event.target.value);
						setOpen(true);
					}}
					onFocus={() => setOpen(true)}
					placeholder="Search products, stores, markets..."
					aria-label="Search products, stores, and markets"
				/>
				<button type="submit" className="icon-btn" aria-label="Search">
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<circle cx="11" cy="11" r="8"></circle>
						<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
					</svg>
				</button>
			</form>

			{open && query.trim() && (
				<div className="search-suggestions">
					{suggestions.length > 0 ? suggestions.map((item) => (
						<button type="button" key={`${item.type}-${item.path}`} onClick={() => handleSelect(item)}>
							<span>{item.name}</span>
							<small>{item.type}{item.detail ? ` · ${item.detail}` : ''}</small>
						</button>
					)) : <p>No products, stores, or markets found.</p>}
				</div>
			)}
		</div>
	);
}

export default SearchBar;
