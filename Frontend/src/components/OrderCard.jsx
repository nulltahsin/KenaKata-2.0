import "./OrderCard.css";

function OrderCard({ order }) {

  const statusClass = (order.status || "Pending").toLowerCase();

  return (
    <div className="order-card">

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



      <div className="order-items">

        {(order.items || []).length === 0 ? (

          <p>No items found</p>

        ) : (

          (order.items || []).map((item, idx) => (

            <div 
              key={idx}
              className="order-item"
            >

              <img
                src={item.image || item.image_url}
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

                ৳{
                  Number(item.price || item.price_at_purchase || 0)
                  *
                  Number(item.quantity || 0)
                }

              </span>


            </div>

          ))

        )}

      </div>



      <div className="order-card-footer">

        <span className="order-payment">
          {order.payment || "N/A"}
        </span>


        <span className="order-total">
          Total ৳{order.total || order.total_amount || 0}
        </span>

      </div>


    </div>
  );
}


export default OrderCard;