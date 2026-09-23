import "./OrderCard.css";
import { Link } from "react-router-dom";

function OrderCard({ order }) {

  const statusClass = (order.status || "Pending").toLowerCase();

  return (
    <div className="order-card">


      {/* Header */}
      <div className="order-card-header">

        <div>

          <span className="order-id">
            Order #{order.id || order.order_id}
          </span>

          <span className="order-date">
            {order.date || ""}
          </span>

        </div>


        <span className={`order-status ${statusClass}`}>
          {order.status || "Pending"}
        </span>


      </div>




      {/* Delivery Information */}
      <div className="order-delivery">

        <h3>
          Delivery Information
        </h3>


        <p>
          <strong>Name:</strong>{" "}
          {order.delivery_name || "N/A"}
        </p>


        <p>
          <strong>Phone:</strong>{" "}
          {order.delivery_phone || "N/A"}
        </p>


        <p>
          <strong>Address:</strong>{" "}
          {order.delivery_address || "N/A"}
        </p>



        {
          order.delivery_notes &&
          <p>
            <strong>Note:</strong>{" "}
            {order.delivery_notes}
          </p>
        }


      </div>






      {/* Items */}

      <div className="order-items">


        {
          (order.items || []).length === 0 ?

          (
            <p>
              No items found
            </p>
          )

          :

          (

            order.items.map((item,idx)=>(

              <div 
                key={idx}
                className="order-item"
              >


                <img
                  src={
                    item.image ||
                    item.image_url ||
                    "https://via.placeholder.com/52"
                  }
                  alt={item.name}
                />



                <div className="order-item-info">


                  <p>
                    {item.name}
                  </p>


                  <span>
                    Qty {item.quantity}
                  </span>


                </div>




                <span className="order-item-price">

                  ৳
                  {
                    Number(
                      item.price ||
                      item.price_at_purchase ||
                      0
                    )
                    *
                    Number(
                      item.quantity || 0
                    )
                  }

                </span>


              </div>

            ))

          )
        }


      </div>







      {/* Footer */}

      <div className="order-card-footer">


        <span className="order-payment">

          Payment:{" "}
          {
            order.payment_method ||
            "Cash on Delivery"
          }

        </span>




        <span className="order-total">

          Total ৳
          {
            order.total ||
            order.total_amount ||
            0
          }

        </span>


      </div>

      {
        order.status === "Delivered" && (

    <div className="review-section">

      {(order.items || []).map((item)=>(

        item.reviewed ? (

          <span
            key={item.order_item_id}
            className="review-done"
          >
            Reviewed ✓
          </span>

        ) : (

          <Link

            key={item.order_item_id}

            to={`/review/${item.order_item_id}`}

            className="review-btn"

          >

            Write Review for {item.name}

          </Link>

        )

      ))}

    </div>

  )
}



    </div>
  );

}


export default OrderCard;