import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";

import { useCart } from "../context/CartContext";
import api from "../services/api";

import "./Cart.css";


function Cart() {

  


  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
    syncCart
  } = useCart();



  const [showToast,setShowToast] = useState(false);
  const [toastMsg,setToastMsg] = useState("");



  const DELIVERY_FEE = 60;


  const total =
    items.length > 0
      ? cartTotal + DELIVERY_FEE
      : 0;






  const expiryByItem = useMemo(()=>{

    const data = {};

    items.forEach(item=>{

      if(item.expires_at){

        data[item.id] =
          new Date(item.expires_at).getTime();

      }

    });


    return data;


  },[items]);







  // auto remove expired hold

  useEffect(()=>{


    if(items.length===0)
      return;



    const timer =
      setInterval(async()=>{


        const now = Date.now();



        const expired =
          Object.values(expiryByItem)
          .some(time=>time <= now);



        if(expired){


          try{


            await api.post(
              "/api/cart/release-expired"
            );


            await syncCart();



            setToastMsg(
              "Expired items removed from cart"
            );


            setShowToast(true);



          }catch(error){

            console.error(
              "Expiry cleanup failed",
              error
            );

          }

        }


      },5000);



    return ()=>clearInterval(timer);



},[
  expiryByItem,
  items.length,
  syncCart
]);









  const handleRemove = async(id)=>{


    const item =
      items.find(
        i=>i.id===id
      );


    await removeFromCart(id);



    setToastMsg(
      `${item?.name || "Item"} removed`
    );


    setShowToast(true);


  };









  if(items.length===0){


    return (

      <div className="cart-page">


        <Navbar />


        <div className="cart-container">


          <div className="cart-empty">


            <h2>
              Your cart is empty
            </h2>


            <p>
              Looks like you have not added anything yet.
            </p>



            <Link
              to="/products"
              className="shop-btn"
            >
              Start Shopping
            </Link>



          </div>


        </div>


        <Footer />


      </div>

    );


  }








  return (


    <div className="cart-page">


      <Navbar />



      <div className="cart-container">



        <div className="cart-header">


          <div>

            <h1>
              Your Cart
            </h1>


            <p>
              {cartCount} items
            </p>


          </div>


          <Link
            to="/products"
            className="header-secondary-btn"
          >
            Continue Shopping
          </Link>


        </div>









        <div className="cart-layout">



          <div className="cart-items">



            {
              items.map(item=>{


                const expiry =
                  expiryByItem[item.id];



                let minutes = 0;
                let seconds = 0;



                if(expiry){


const remaining =
  Math.max(
    0,
    Number(expiry) - Date.now()
  );


                  minutes =
                    Math.floor(
                      remaining/60000
                    );


                  seconds =
                    Math.floor(
                      (remaining%60000)/1000
                    );

                }




                return (


                  <div
                    key={item.id}
                    className="cart-item"
                  >



                    <div className="cart-item-image">


                      <img
                        src={item.image}
                        alt={item.name}
                      />


                    </div>






                    <div className="cart-item-info">



                      <div className="cart-item-top">


                        <div>


                          <h3>
                            {item.name}
                          </h3>


                          <p className="cart-item-store">
                            {item.store}
                          </p>


                        </div>




                        <button
                          className="cart-remove-btn"
                          onClick={()=>
                            handleRemove(item.id)
                          }
                        >
                          Remove
                        </button>



                      </div>







                      <div className="cart-item-bottom">



                        <div className="quantity-box">


                          <button
                            onClick={()=>
                              updateQuantity(item.id,-1)
                            }
                          >
                            -
                          </button>



                          <span>
                            {item.quantity}
                          </span>




                          <button
                            onClick={()=>
                              updateQuantity(item.id,1)
                            }
                          >
                            +
                          </button>



                        </div>





                        <span className="cart-item-price">

                          ৳
                          {
                            item.price *
                            item.quantity
                          }

                        </span>



                      </div>






                      {
                        expiry &&
                        <div className="cart-expiry">

                          Hold expires in{" "}
                          {minutes}:
                          {
                            String(seconds)
                            .padStart(2,"0")
                          }

                        </div>
                      }





                    </div>



                  </div>


                );


              })

            }



          </div>









          <aside className="cart-summary">



            <h2>
              Order Summary
            </h2>




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





            <Link
              to="/checkout"
              className="checkout-btn"
            >
              Proceed to Checkout
            </Link>




          </aside>




        </div>




      </div>





      <Footer />




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



export default Cart;