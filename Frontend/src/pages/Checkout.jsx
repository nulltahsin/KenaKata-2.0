import { useState } from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Toast from "../components/Toast";

import { useCart } from "../context/CartContext";

import {
  checkoutOrder
} from "../services/orderService";

import "./Checkout.css";



function Checkout(){


const navigate = useNavigate();


const {
  items,
  cartTotal,
  clearCart
}=useCart();



const DELIVERY_FEE = 60;


const total =
cartTotal + DELIVERY_FEE;



const [toastMsg,setToastMsg]
=
useState("");

const [showToast,setShowToast]
=
useState(false);



const [form,setForm]=useState({

  fullName:"",
  phone:"",
  address:"",
  area:"",
  city:"Dhaka",
  notes:""

});





const handleChange=(e)=>{

 setForm({

  ...form,

  [e.target.name]:
  e.target.value

 });

};





const handleSubmit=async(e)=>{

 e.preventDefault();



 if(
 !form.fullName ||
 !form.phone ||
 !form.address ||
 !form.area
 ){

 setToastMsg(
 "Please fill all required fields"
 );

 setShowToast(true);

 return;

 }



 try{


 const order =
 await checkoutOrder({

    delivery_name:
    form.fullName,


    delivery_phone:
    form.phone,


    delivery_address:
    `${form.address}, ${form.area}, ${form.city}`,


    delivery_notes:
    form.notes,


    payment_method:
    "Cash on Delivery"


 });



 await clearCart();



 navigate(
 `/order-success/${order.order_id}`
 );



 }
 catch(error){


 console.error(error);


 setToastMsg(

 error.response?.data?.message ||
 "Unable to place order"

 );


 setShowToast(true);


 }


};







if(items.length===0){

return(

<div className="checkout-page">

<Navbar/>

<div className="checkout-container">

<div className="checkout-empty">

<h2>
Your cart is empty
</h2>

<p>
Add some products before checkout.
</p>


<Link
to="/products"
className="shop-btn"
>
Browse Products
</Link>


</div>

</div>


<Footer/>

</div>

);

}







return(

<div className="checkout-page">


<Navbar/>


<div className="checkout-container">


<div className="checkout-header">

<h1>
Checkout
</h1>


<p>
Complete your order
</p>


</div>





<form

className="checkout-layout"

onSubmit={handleSubmit}

>



<div className="checkout-form">



<section className="form-section">


<h2>
Delivery Information
</h2>



<div className="form-grid">



<div className="form-field">

<label>
Full Name
</label>


<input

name="fullName"

value={form.fullName}

onChange={handleChange}

placeholder="Rahim Uddin"

/>


</div>





<div className="form-field">

<label>
Phone
</label>


<input

name="phone"

value={form.phone}

onChange={handleChange}

placeholder="01XXXXXXXXX"

/>


</div>






<div className="form-field full">

<label>
Address
</label>


<input

name="address"

value={form.address}

onChange={handleChange}

placeholder="House, Road"

/>


</div>







<div className="form-field">


<label>
Area
</label>


<input

name="area"

value={form.area}

onChange={handleChange}

placeholder="Dhanmondi"

/>


</div>








<div className="form-field">


<label>
City
</label>


<select

name="city"

value={form.city}

onChange={handleChange}

>


<option>
Dhaka
</option>

<option>
Chittagong
</option>

<option>
Sylhet
</option>


<option>
Khulna
</option>


</select>


</div>






<div className="form-field full">


<label>
Delivery Notes
</label>


<textarea

name="notes"

value={form.notes}

onChange={handleChange}

rows="3"

placeholder="Any instructions..."

/>


</div>



</div>


</section>








<section className="form-section">


<h2>
Payment Method
</h2>


<div className="payment-option active">


<div className="payment-info">

<strong>
Cash on Delivery
</strong>


<span>
Pay after receiving your order
</span>


</div>


</div>


</section>






</div>










<aside className="checkout-summary">


<h2>
Order Summary
</h2>




<div className="summary-items">


{

items.map(item=>(


<div

key={item.id}

className="summary-item"

>


<img

src={item.image}

alt={item.name}

/>


<div>

<p>
{item.name}
</p>


<span>
Qty {item.quantity}
</span>


</div>


<strong>
৳
{item.price*item.quantity}
</strong>



</div>


))

}



</div>





<div className="summary-row">

<span>
Subtotal
</span>


<span>
৳{cartTotal}
</span>


</div>





<div className="summary-row">

<span>
Delivery Fee
</span>


<span>
৳{DELIVERY_FEE}
</span>


</div>





<div className="summary-row total">


<span>
Total
</span>


<span>
৳{total}
</span>


</div>







<button

type="submit"

className="place-order-btn"

>

Place Order

</button>





<Link

to="/cart"

className="back-cart"

>

← Back to Cart

</Link>



</aside>





</form>


</div>



<Footer/>


<Toast

show={showToast}

message={toastMsg}

onHide={()=>
setShowToast(false)
}

/>



</div>

);


}


export default Checkout;