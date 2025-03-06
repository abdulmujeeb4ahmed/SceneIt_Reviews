import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);

    // Fetch reviews from backend
    useEffect(() => {
        axios.get('http://localhost:5001/api/reviews')  // Make sure this is correct
            .then(response => setReviews(response.data))
            .catch(error => console.error("Error fetching reviews:", error));
    }, []);

    return (
        <div>
            <h2>Reviews</h2>
            {reviews.length > 0 ? (
                reviews.map(review => (
                    <div key={review._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                        <h4>Movie ID: {review.movie_id}</h4>
                        <p><strong>Rating:</strong> {review.rating} ⭐</p>
                        <p><strong>Review:</strong> {review.review_text}</p>
                        <p><strong>Upvotes:</strong> {review.votes.upvotes} 👍 | <strong>Downvotes:</strong> {review.votes.downvotes} 👎</p>
                        <p><strong>Created At:</strong> {new Date(review.created_at).toLocaleString()}</p>
                    </div>
                ))
            ) : (
                <p>No reviews available.</p>
            )}
        </div>
    );
};

export default Reviews;
