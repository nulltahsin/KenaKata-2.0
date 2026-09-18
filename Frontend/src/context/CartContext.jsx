import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";


export const CartContext = createContext(null);


const getCartStorageKey = (user) =>
  user?.id ? `kenakata_cart_${user.id}` : "kenakata_cart_guest";


const readCartFromStorage = (user) => {
  try {
    const data = localStorage.getItem(getCartStorageKey(user));

    if (!data) return [];

    const parsed = JSON.parse(data);

    return Array.isArray(parsed) ? parsed : [];

  } catch (error) {
    console.error("Cart storage error:", error);
    return [];
  }
};



export function CartProvider({ children }) {

  const { user } = useAuth();

  const [items, setItems] = useState(() =>
    readCartFromStorage(user)
  );



  const syncCart = async () => {

    if (!user?.id) {

      setItems(readCartFromStorage(user));

      return;
    }


    try {

      const response = await api.get("/api/cart");


      const mapped = response.data.map((item) => ({
        
        id: item.product_id,

        product_id: item.product_id,

        hold_id: item.hold_id,

        name: item.name,

        store: item.store,

        price: Number(item.price),

        image: item.image,

        quantity: Number(item.quantity),

        expires_at: item.expires_at

      }));


      setItems(mapped);


      localStorage.setItem(
        getCartStorageKey(user),
        JSON.stringify(mapped)
      );


    } catch(error){

      console.error(
        "Failed to sync cart:",
        error
      );

    }

  };




  useEffect(() => {

    syncCart();

  },[user?.id]);







  const addToCart = async(product, quantity = 1)=>{


    const productId =
      product.product_id || product.id;


    if(!productId){

      throw new Error(
        "Product id missing"
      );

    }




    // Guest cart

    if(!user?.id){


      const cart =
        [...readCartFromStorage(user)];



      const existing =
        cart.find(
          item=>item.id===productId
        );



      if(existing){

        existing.quantity += quantity;

      }

      else{


        cart.push({

          id: productId,

          product_id: productId,

          name: product.name,

          store: product.store,

          price:Number(product.price),

          image:product.image,

          quantity

        });

      }



      setItems(cart);


      localStorage.setItem(
        getCartStorageKey(user),
        JSON.stringify(cart)
      );


      return cart;

    }






    // Logged in customer cart


    try{


      const response =
        await api.post(
          "/api/cart/add",
          {

            product_id:productId,

            quantity:Number(quantity)

          }
        );


      await syncCart();


      return response.data;


    }catch(error){

      console.error(
        "Add cart failed:",
        error
      );

      throw error;

    }

  };









  const removeFromCart = async(id)=>{


    if(!user?.id){


      const updated =
        items.filter(
          item=>item.id!==id
        );


      setItems(updated);


      localStorage.setItem(
        getCartStorageKey(user),
        JSON.stringify(updated)
      );


      return;

    }




    try{


      await api.delete(
        `/api/cart/remove/${id}`
      );


      await syncCart();


    }catch(error){

      console.error(
        "Remove failed:",
        error
      );

      throw error;

    }

  };









  const updateQuantity = async(id,delta)=>{


    if(!user?.id){


      const updated =
        items.map(item=>{


          if(item.id===id){

            return {

              ...item,

              quantity:
                Math.max(
                  1,
                  item.quantity + delta
                )

            };

          }


          return item;


        });



      setItems(updated);


      localStorage.setItem(
        getCartStorageKey(user),
        JSON.stringify(updated)
      );


      return;

    }






    const current =
      items.find(
        item=>item.id===id
      );


    if(!current) return;



    const newQuantity =
      Math.max(
        1,
        current.quantity + delta
      );


    const difference =
      newQuantity-current.quantity;



    if(difference===0)
      return;




    try{


      await api.post(
        "/api/cart/add",
        {

          product_id:id,

          quantity:difference

        }
      );


      await syncCart();



    }catch(error){

      console.error(
        "Quantity update failed:",
        error
      );

      throw error;

    }

  };









  const clearCart = async()=>{


    if(!user?.id){

      setItems([]);

      localStorage.removeItem(
        getCartStorageKey(user)
      );

      return;

    }





    try{


      await api.delete(
        "/api/cart/clear"
      );


      setItems([]);


      localStorage.removeItem(
        getCartStorageKey(user)
      );



    }catch(error){

      console.error(
        "Clear cart failed:",
        error
      );

      throw error;

    }

  };








  const cartCount =
    items.reduce(
      (sum,item)=>
        sum + Number(item.quantity || 0),
      0
    );



  const cartTotal =
    items.reduce(
      (sum,item)=>
        sum +
        Number(item.price || 0) *
        Number(item.quantity || 0),
      0
    );






  return (

    <CartContext.Provider

      value={{

        items,

        addToCart,

        removeFromCart,

        updateQuantity,

        clearCart,

        cartCount,

        cartTotal,

        syncCart

      }}

    >

      {children}

    </CartContext.Provider>

  );

}






export function useCart(){

  return useContext(CartContext);

}