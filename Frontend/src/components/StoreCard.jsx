import { Link } from 'react-router-dom';
import './StoreCard.css';


function StoreCard({ store }) {

  return (

    <Link
      to={`/products?store=${store.store_id}`}
      className="store-card"
    >


      <div className="store-card-image">

        <div className="store-placeholder">
          🏬
        </div>

      </div>



      <div className="store-card-content">


        <h3>
          {store.store_name}
        </h3>


        <p className="store-location">

          {store.address}

        </p>



        <div className="store-meta">

          <span className="store-category">

            Store

          </span>


        </div>



      </div>


    </Link>

  );

}


export default StoreCard;