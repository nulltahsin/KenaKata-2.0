import { useEffect, useState } from 'react';

import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ProductManagement from '../components/ProductManagement';
import ShopOnboardingForm from '../components/ShopOnboardingForm';


import {
  getMarkets,
  getVendorStore
} from '../services/storeService';

import {
  getProducts
} from '../services/productService';

import {
  getVendorOrders,
  getVendorReservations,
  getVendorReviews,
  updateOrderStatus,
  updateVendorReservation
} from '../services/vendorService';


import './VendorDashboard.css';



function VendorDashboard(){


const [store,setStore] = useState(null);

const [products,setProducts] = useState([]);

const [orders,setOrders] = useState([]);

const [reservations,setReservations] = useState([]);

const [markets,setMarkets] = useState([]);

const [reviews,setReviews]=useState([]);


const [activeSection,setActiveSection] = useState(
'analytics'
);


const [editingShop,setEditingShop] = useState(false);


const [loading,setLoading] = useState(true);


const [error,setError] = useState('');



const normalizeStore=(response)=>{

const savedStore =
response?.store || response || {};


return {

...savedStore,

categories:
[
...new Set(
String(savedStore.category || '')
.split(',')
.map(c=>c.trim())
.filter(Boolean)
)

]

};


};





const loadDashboard = async()=>{

try{

setLoading(true);
setError("");


const vendorStore = await getVendorStore();
console.log("STORE OK");


const marketList = await getMarkets();
console.log("MARKET OK");


const orderList = await getVendorOrders();
console.log("ORDER OK");


const reservationList = await getVendorReservations();
console.log("RESERVATION OK");

const productList = vendorStore?.store_id
  ? await getProducts(vendorStore.store_id)
  : [];
setStore(normalizeStore(vendorStore));

setMarkets(marketList || []);

setOrders(orderList || []);

setReservations(reservationList || []);

setProducts(productList || []);


}
catch(error){

console.log("DASHBOARD ERROR",error);

setError(
error.response?.data?.message || error.message
);


}
finally{
  console.log("LOAD DASHBOARD FINISHED");

setLoading(false);

}


}


useEffect(()=>{

const initDashboard = async()=>{


// dashboard data
await loadDashboard();


// reviews আলাদা independent
try{

const data = await getVendorReviews();

console.log(
"VENDOR REVIEWS FRONTEND = ",
data
);

setReviews(data || []);

}
catch(error){

console.log(
"Review fetch error:",
error.response?.data || error.message
);

}


};


initDashboard();


},[]);





const handleStoreSaved=(savedStore)=>{


setStore(
normalizeStore(savedStore)
);


setEditingShop(false);


setActiveSection(
'analytics'
);


loadDashboard();


};






const handleStatusUpdate=
async(orderId,status)=>{


try{


await updateOrderStatus(
orderId,
status
);


await loadDashboard();


}

catch(error){


console.error(
"Status update failed",
error
);

setError(
error.response?.data?.message ||
"Unable to update order status"
);


}


};

const handleReservationStatusUpdate = async (reservationId, status) => {
  try {
    await updateVendorReservation(reservationId, status);
    await loadDashboard();
  } catch (requestError) {
    setError(requestError.response?.data?.message || 'Unable to update reservation');
  }
};






const navigation=[

 ['analytics','Overview'],

 ['profile','Profile'],

 ['shop','Shop details'],

 ['products','Products'],

 ['orders','Orders'],

 ['reservations','Reservations'],

 ['reviews','Reviews']

];



return (

<div className="vendor-page">


<Navbar />


<main className="vendor-container">


<header className="vendor-header">


<div>


<p className="vendor-eyebrow">
Seller portal
</p>


<h1>
Run your shop
</h1>


<p>
Manage products, orders and storefront.
</p>


</div>



{
store &&

<div className="vendor-header-stat">

<strong>
{products.length}
</strong>

<span>
products listed
</span>


</div>

}


</header>



{
loading &&

<div className="vendor-loading">

Loading your dashboard...

</div>

}



{
!loading && error &&

<div className="vendor-error vendor-notice">

{error}


<button
onClick={loadDashboard}
>

Try again

</button>


</div>

}



{
!loading &&
!error &&
!store &&

<ShopOnboardingForm

store={store}

markets={markets}

onSaved={handleStoreSaved}

/>


}



{
!loading &&
!error &&
store &&

<div className="vendor-workspace">


<aside className="vendor-sidebar">


<div className="vendor-profile-chip">


{
store.logo_url ?

<img

className="vendor-shop-logo"

src={store.logo_url}

/>

:

<div className="vendor-avatar">

{
store.store_name
.charAt(0)
.toUpperCase()

}

</div>

}


<div>

<strong>
{store.store_name}
</strong>


<span>
Vendor account
</span>


</div>


</div>



<nav>


{
navigation.map(([section,label])=>(


<button

key={section}

className={
activeSection===section
?
'active'
:
''
}


onClick={()=>setActiveSection(section)}

>


{label}


</button>


))

}


</nav>


</aside>



<div className="vendor-content">
{/* ANALYTICS SECTION */}

{
activeSection === 'analytics' &&

<>


<section className="vendor-panel">


<div className="vendor-panel-heading">


<div>

<p className="vendor-eyebrow">
Analytics / sales
</p>


<h2>
Shop overview
</h2>


<p>
Current marketplace activity summary.
</p>


</div>


</div>





<div className="vendor-metric-grid">


<div>

<span>
Products
</span>


<strong>
{products.length}
</strong>


</div>



<div>

<span>
Orders
</span>


<strong>
{orders.length}
</strong>


</div>



<div>

<span>
Reservations
</span>


<strong>
{reservations.length}
</strong>


</div>



<div>

<span>
Category
</span>


<strong>
{store.category || 'General'}
</strong>


</div>



</div>



</section>





<section className="vendor-panel vendor-overview-shop">


<div className="vendor-overview-shop-identity">


{

store.logo_url ?

<img

className="vendor-large-logo"

src={store.logo_url}

alt="shop logo"

/>


:


<div className="vendor-large-avatar">

{
store.store_name
.charAt(0)
.toUpperCase()

}

</div>


}



<div>


<p className="vendor-eyebrow">

Your storefront

</p>


<h2>

{store.store_name}

</h2>


<p>

{store.address}

{
store.market_name
?
`, ${store.market_name}`
:
''

}

</p>


</div>



</div>




<button

className="vendor-primary-button"

onClick={()=>{

setActiveSection('shop');

setEditingShop(true);

}}

>

Edit shop profile

</button>



</section>



</>

}





{/* PROFILE SECTION */}


{

activeSection === 'profile' &&


<section className="vendor-panel">


<div className="vendor-panel-heading">


<div>


<p className="vendor-eyebrow">
Profile
</p>


<h2>
Vendor account
</h2>


<p>
Account information.
</p>


</div>


</div>





<div className="vendor-profile-details">


<span>

Name


<strong>

{
localStorage.getItem('kenakata_user')

?

JSON.parse(
localStorage.getItem('kenakata_user')
).name

:

'Vendor'

}


</strong>


</span>





<span>

Shop


<strong>

{store.store_name}

</strong>


</span>





<span>

Location


<strong>

{store.address}

</strong>


</span>



</div>



</section>


}





{/* SHOP DETAILS SECTION */}



{

activeSection === 'shop' &&


(

editingShop ?

<ShopOnboardingForm


store={store}

markets={markets}

onSaved={handleStoreSaved}


onCancel={()=>setEditingShop(false)}


/>


:


<section className="vendor-panel vendor-shop-summary">


<div className="vendor-panel-heading">


<div>


<p className="vendor-eyebrow">

Shop details

</p>


<h2>

{store.store_name}

</h2>


<p>

{
store.description ||
'Your storefront information'
}


</p>


</div>




{

store.logo_url ?

<img

className="vendor-large-logo"

src={store.logo_url}

/>


:


<div className="vendor-large-avatar">

{
store.store_name
.charAt(0)
.toUpperCase()

}

</div>


}



</div>





<div className="vendor-profile-details">


<span>

Location


<strong>

{store.address}

</strong>


</span>





<span>

Category


<strong>

{
store.category ||
'General'

}

</strong>


</span>





<span>

Market


<strong>

{
store.market_name ||
'Selected market'

}

</strong>


</span>


</div>




<button

className="vendor-primary-button"

onClick={()=>setEditingShop(true)}

>

Edit shop details

</button>



</section>


)


}
{/* PRODUCTS SECTION */}


{
activeSection === 'products' &&


<ProductManagement

store={store}

products={products}

onProductsChange={setProducts}


/>

}







{/* ORDERS SECTION */}



{

activeSection === 'orders' &&


<section className="vendor-panel">


<div className="vendor-panel-heading">


<div>


<p className="vendor-eyebrow">
Sales
</p>


<h2>
Incoming Orders
</h2>


<p>
Manage customer orders from your shop.
</p>


</div>


<span className="vendor-count">

{orders.length} orders

</span>



</div>





{

orders.length === 0 ?


<div className="vendor-empty">

No orders received yet.

</div>



:


<div className="orders-table-wrap">


<table className="product-table">


<thead>


<tr>


<th>
Order
</th>


<th>
Product
</th>


<th>
Quantity
</th>


<th>
Amount
</th>


<th>
Payment
</th>


<th>
Status
</th>


<th>
Action
</th>


</tr>


</thead>




<tbody>



{

orders.map(order=>(


<tr

key={`${order.order_id}-${order.product_id}`}

>


<td>

#{order.order_id}

</td>



<td>

{order.product_name}

</td>



<td>

{order.quantity}

</td>



<td>

৳
{
(
Number(order.price_at_purchase)
*
Number(order.quantity)

).toFixed(2)

}


</td>



<td>

Cash on Delivery

</td>




<td>


<span className="order-status">

{order.status}

</span>



</td>




<td className="table-actions">





{

order.status === "Pending" &&


<>


<button

type="button"

onClick={()=>


handleStatusUpdate(

order.order_id,

"Confirmed"

)


}

>

Confirm

</button>





<button

type="button"

onClick={()=>


handleStatusUpdate(

order.order_id,

"Cancelled"

)


}

>

Cancel

</button>


</>


}








{

order.status === "Confirmed" &&


<button

type="button"

onClick={()=>


handleStatusUpdate(

order.order_id,

"Shipped"

)


}

>

Ship

</button>


}







{

order.status === "Shipped" &&


<button

type="button"

onClick={()=>


handleStatusUpdate(

order.order_id,

"Delivered"

)


}

>

Deliver

</button>


}





</td>



</tr>



))


}



</tbody>


</table>


</div>



}



</section>


}







{/* RESERVATIONS SECTION */}



{

activeSection === 'reservations' &&


<section className="vendor-panel">


<div className="vendor-panel-heading">


<div>


<p className="vendor-eyebrow">

Reservations

</p>


<h2>

Reservation requests

</h2>


<p>

Customer reservation list.

</p>


</div>



<span className="vendor-count">

{reservations.length} total

</span>


</div>





{

reservations.length === 0 ?


<div className="vendor-empty">

No reservations yet.

</div>




:


<div className="orders-table-wrap">


<table className="product-table">


<thead>


<tr>


<th>
Customer
</th>


<th>
Product
</th>


<th>
Quantity
</th>


<th>
Reserved
</th>


<th>
Status
</th>


<th>
Action
</th>


</tr>


</thead>




<tbody>



{

reservations.map(reservation=>(


<tr key={reservation.reservation_id}>


<td>

{reservation.customer_name}

</td>



<td>

{reservation.product_name}

</td>



<td>

{reservation.quantity}

</td>


<td>
{new Date(reservation.created_at || reservation.deadline).toLocaleString()}

</td>




<td>


<span className="order-status">

{reservation.status}

</span>



</td>


<td className="table-actions">
{reservation.status === 'Pending' && (
<>
<button type="button" onClick={() => handleReservationStatusUpdate(reservation.reservation_id, 'Completed')}>
Confirm Sale
</button>
<button type="button" onClick={() => handleReservationStatusUpdate(reservation.reservation_id, 'Cancelled')}>
Cancel Reservation
</button>
</>
)}
</td>



</tr>


))


}



</tbody>



</table>



</div>


}



</section>


}


{
activeSection === 'reviews' &&

<section className="vendor-panel">


<div className="vendor-panel-heading">

<div>

<p className="vendor-eyebrow">
Reviews
</p>

<h2>
Customer Reviews
</h2>

<p>
Customer feedback about your products.
</p>

</div>


<span className="vendor-count">
{reviews.length} total
</span>


</div>



{
reviews.length === 0 ?

<div className="vendor-empty">
No reviews yet.
</div>


:

<div className="orders-table-wrap">


<table className="product-table">


<thead>

<tr>

<th>
Product
</th>

<th>
Customer
</th>

<th>
Rating
</th>

<th>
Comment
</th>

</tr>

</thead>



<tbody>


{
reviews.map(review=>(

<tr key={review.review_id}>


<td>
{review.product_name}
</td>


<td>
{review.customer_name}
</td>


<td>
{"⭐".repeat(review.rating)}
</td>


<td>
{review.comment}
</td>


</tr>

))

}



</tbody>


</table>


</div>


}


</section>

}




</div>


</div>


}





</main>



<Footer />



</div>



);

}


export default VendorDashboard;