import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Toast from "../components/Toast";
import api from "../services/api";
import "./Review.css";


function Review(){

    const { id } = useParams();

    const navigate = useNavigate();


    const [rating,setRating] = useState(5);

    const [comment,setComment] = useState("");

    const [loading,setLoading] = useState(false);

    const [toastMsg,setToastMsg] = useState("");

    const [showToast,setShowToast] = useState(false);



    const submitReview = async()=>{


        if(!comment.trim()){

            setToastMsg("Please write your review");

            setShowToast(true);

            return;

        }


        try{

            setLoading(true);


            await api.post(
                "/api/reviews",
                {
                    order_item_id:id,
                    rating:Number(rating),
                    comment
                }
            );


            setToastMsg(
                "Review submitted successfully"
            );

            setShowToast(true);



            setTimeout(()=>{

                navigate("/orders");

            },1500);



        }
        catch(error){

            console.error(error);


            setToastMsg(
                error.response?.data?.message ||
                "Unable to submit review"
            );

            setShowToast(true);

        }
        finally{

            setLoading(false);

        }

    };





    return(

        <div className="review-page">


            <Navbar/>


            <div className="review-container">


                <div className="review-card">


                    <h1>
                        Write Review
                    </h1>


                    <p>
                        Share your experience with this product
                    </p>




                    <label>
                        Rating
                    </label>


                    <select

                        value={rating}

                        onChange={
                            (e)=>setRating(e.target.value)
                        }

                    >

                        <option value="5">
                            ⭐⭐⭐⭐⭐
                        </option>

                        <option value="4">
                            ⭐⭐⭐⭐
                        </option>

                        <option value="3">
                            ⭐⭐⭐
                        </option>

                        <option value="2">
                            ⭐⭐
                        </option>

                        <option value="1">
                            ⭐
                        </option>


                    </select>




                    <label>
                        Your Review
                    </label>


                    <textarea

                        rows="5"

                        placeholder="Write your experience..."

                        value={comment}

                        onChange={
                            (e)=>setComment(e.target.value)
                        }

                    />





                    <button

                        onClick={submitReview}

                        disabled={loading}

                    >

                        {
                            loading
                            ?
                            "Submitting..."
                            :
                            "Submit Review"
                        }


                    </button>



                </div>


            </div>



            <Footer/>




            <Toast

                show={showToast}

                message={toastMsg}

                onHide={
                    ()=>setShowToast(false)
                }

            />


        </div>

    );

}



export default Review;