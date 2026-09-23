import { Link, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./OrderSuccess.css";


function OrderSuccess(){

const {id}=useParams();



return (

<div className="order-success-page">


<Navbar/>


<div className="order-success-container">


<div className="success-card">


<div className="success-icon">

✓

</div>



<h1>
Order Placed Successfully!
</h1>



<p className="success-message">

Thank you for your order.  
Your order has been placed and is waiting for seller confirmation.

</p>




<div className="order-info-box">


<div>

<span>
Order ID
</span>

<strong>
#{id}
</strong>

</div>




<div>

<span>
Payment
</span>

<strong>
Cash on Delivery
</strong>

</div>




<div>

<span>
Status
</span>

<strong className="pending">
Pending
</strong>

</div>



</div>






<p className="seller-message">

The seller will review your order and update the delivery status soon.

</p>







<div className="success-actions">


<Link

to="/orders"

className="primary-btn"

>

View My Orders

</Link>




<Link

to="/products"

className="secondary-btn"

>

Continue Shopping

</Link>


</div>





</div>


</div>



<Footer/>


</div>

);


}


export default OrderSuccess;