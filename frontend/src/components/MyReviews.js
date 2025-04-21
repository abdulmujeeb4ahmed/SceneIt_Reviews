import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../AuthContext'
import {
  getMyReviews,
  fetchMovieById,
  updateReview,
  deleteReview,
  submitThumb,
  getThumbCount
} from '../axios'

export default function MyReviews() {
  const { user } = useContext(AuthContext)
  const [reviews, setReviews] = useState([])
  const [titles, setTitles] = useState({})
  const [counts, setCounts] = useState({})
  const [editingId, setEditingId] = useState(null)
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    if (!user) return
    getMyReviews().then(data => {
      setReviews(data)
      data.forEach(r => {
        fetchMovieById(r.movie).then(m => {
          setTitles(t => ({ ...t, [r._id]: m.Title }))
        })
        getThumbCount(r._id).then(c => {
          setCounts(cnt => ({ ...cnt, [r._id]: c }))
        })
      })
    })
  }, [user])

  if (!user) return (
    <div style={{ padding:'2rem', maxWidth:800, margin:'auto' }}>
      <p>Please <Link to="/login">log in</Link> first.</p>
    </div>
  )

  const handleThumb = (id, type) => {
    submitThumb(id, type).then(() => {
      getThumbCount(id).then(c => {
        setCounts(cnt => ({ ...cnt, [id]: c }))
      })
    }).catch(() => {
      alert('Please log in to react')
    })
  }

  const handleSave = id => {
    updateReview(id, editContent).then(res => {
      const updated = res.review || res
      setReviews(rs => rs.map(r => r._id === id ? updated : r))
      setEditingId(null)
      setEditContent('')
    })
  }

  const handleDelete = id => {
    deleteReview(id).then(() => {
      setReviews(rs => rs.filter(r => r._id !== id))
    })
  }

  return (
    <div style={{ padding:'2rem', maxWidth:800, margin:'auto' }}>
      <h1>My Reviews</h1>
      {reviews.length > 0 ? reviews.map(r => (
        <div key={r._id} style={{ border:'1px solid #ddd', padding:'1rem', marginBottom:'1rem' }}>
          <Link to={`/movie/${r.movie}`} style={{ textDecoration:'none', color:'#4B0082' }}>
            <strong>Movie: {titles[r._id] || 'Loading…'}</strong>
          </Link>

          {editingId === r._id ? (
            <>
              <textarea
                rows={3}
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                style={{ width:'100%', margin:'0.5rem 0' }}
              />
              <button onClick={() => handleSave(r._id)}>Save</button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <p style={{ margin:'0.5rem 0' }}>{r.content}</p>
              {user.username === r.username && (
                <>
                  <button onClick={() => { setEditingId(r._id); setEditContent(r.content) }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(r._id)}>
                    Delete
                  </button>
                </>
              )}
            </>
          )}

          <div style={{ marginTop:'0.5rem' }}>
            <button onClick={() => handleThumb(r._id, 'up')}>
              👍 {counts[r._id]?.thumbsUp || 0}
            </button>
            <button onClick={() => handleThumb(r._id, 'down')} style={{ marginLeft:8 }}>
              👎 {counts[r._id]?.thumbsDown || 0}
            </button>
          </div>
        </div>
      )) : (
        <p>You haven’t written any reviews yet.</p>
      )}
    </div>
  )
}
