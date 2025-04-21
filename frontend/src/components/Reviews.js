import React, { useEffect, useState } from 'react'
import { getAllReviews } from '../axios'
import { Link } from 'react-router-dom'

export default function Reviews() {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    getAllReviews().then(setReviews).catch(console.error)
  }, [])

  return (
    <div style={{ padding:'2rem', maxWidth:800, margin:'auto', fontFamily:'sans-serif' }}>
      <h1>All Reviews</h1>
      {reviews.length > 0 ? reviews.map(r => (
        <div key={r._id} style={{ border:'1px solid #ddd', borderRadius:4, padding:'1rem', marginBottom:'1rem', background:'#fafafa' }}>
          <Link to={`/movie/${r.movie}`} style={{ fontWeight:'bold', textDecoration:'none', color:'#333' }}>
            Movie: {r.movie}
          </Link>
          <p><strong>{r.username}</strong>: {r.content}</p>
        </div>
      )) : (
        <p>No reviews have been posted yet.</p>
      )}
    </div>
  )
}
