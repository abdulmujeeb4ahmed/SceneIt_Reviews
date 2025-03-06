const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  content: { type: String, required: true },
  movie: { type: String, required: true },
  username: { type: String, required: true },
  thumbsUp: { type: Number, default: 0 },
  thumbsDown: { type: Number, default: 0 }
});

module.exports = mongoose.model('Review', reviewSchema);

const handleThumbsUp = (id) => {
    axios.post(`http://localhost:5000/reviews/${id}/thumbs-up`)
      .then(response => {
        setReviews(reviews.map(review => review._id === id ? response.data : review));
      });
  };
  
  const handleThumbsDown = (id) => {
    axios.post(`http://localhost:5000/reviews/${id}/thumbs-down`)
      .then(response => {
        setReviews(reviews.map(review => review._id === id ? response.data : review));
      });
  };
  
  <><button onClick={() => handleThumbsUp(review._id)}>👍</button><button onClick={() => handleThumbsDown(review._id)}>👎</button></>