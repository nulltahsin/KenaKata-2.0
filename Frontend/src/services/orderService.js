


import api from "./api";



// get customer orders

export async function getOrders(){

    const response = await api.get(
        "/api/orders"
    );


    return response.data.map(order=>({

        ...order,

        id:order.order_id,

        total:order.total_amount,

        date:
        order.created_at ||
        order.order_date ||
        ""

    }));

}







// checkout complete order

export async function checkoutOrder(orderData){


    const response = await api.post(

        "/api/orders/checkout",

        orderData

    );


    return response.data;


}


