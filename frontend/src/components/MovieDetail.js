import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import {
  fetchMovieById,
  getReviewsByMovie,
  submitReview,
  updateReview,
  deleteReview,
  submitThumb,
  getThumbCount
} from '../axios'
import { AuthContext } from '../AuthContext'

export default function MovieDetail() {
  const { imdbID } = useParams()
  const { user } = useContext(AuthContext)

  const [movie, setMovie] = useState(null)
  const [reviews, setReviews] = useState([])
  const [content, setContent] = useState('')
  const [editId, setEditId] = useState(null)
  const [editContent, setEditContent] = useState('')
  const [counts, setCounts] = useState({})

  useEffect(() => {
    fetchMovieById(imdbID).then(setMovie)
    getReviewsByMovie(imdbID).then(revs => {
      setReviews(revs)
      revs.forEach(r => {
        getThumbCount(r._id).then(c => {
          setCounts(prev => ({ ...prev, [r._id]: c }))
        })
      })
    })
  }, [imdbID])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!content.trim()) return
    const newRev = await submitReview(imdbID, content)
    setReviews(prev => [...prev, newRev])
    setContent('')
    getThumbCount(newRev._id).then(c => {
      setCounts(prev => ({ ...prev, [newRev._id]: c }))
    })
  }

  const startEdit = (id, txt) => {
    setEditId(id)
    setEditContent(txt)
  }

  const handleSave = async id => {
    if (!editContent.trim()) return
    const updated = await updateReview(id, editContent)
    setReviews(rs => rs.map(r => (r._id === id ? updated : r)))
    setEditId(null)
  }

  const handleDelete = async id => {
    await deleteReview(id)
    setReviews(rs => rs.filter(r => r._id !== id))
  }

  const handleThumb = async (id, type) => {
    if (!user) {
      alert('Please log in to react')
      return
    }
    await submitThumb(id, type)
    const c = await getThumbCount(id)
    setCounts(prev => ({ ...prev, [id]: c }))
  }

  if (!movie) return null

  return (
    <div style={{ padding: '2rem', maxWidth: 800, margin: 'auto' }}>
      <h1>
        {movie.Title} ({movie.Year})
      </h1>
      <img
        src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.png'}
        alt={movie.Title}
        style={{ width: '100%', maxWidth: 300, marginBottom: '1rem' }}
      />
      <p>{movie.Plot}</p>

      <h2>Reviews</h2>
      {reviews.length ? (
        reviews.map(r => (
          <div
            key={r._id}
            style={{ borderBottom: '1px solid #ddd', padding: '1rem 0' }}
          >
            <strong>{r.username}</strong>
            {editId === r._id ? (
              <>
                <textarea
                  rows={3}
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  style={{ width: '100%', margin: '0.5rem 0' }}
                />
                <button onClick={() => handleSave(r._id)}>Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </>
            ) : (
              <p style={{ margin: '0.5rem 0' }}>{r.content}</p>
            )}
            {user?.username === r.username && editId !== r._id && (
              <>
                <button onClick={() => startEdit(r._id, r.content)}>
                  Edit
                </button>
                <button onClick={() => handleDelete(r._id)}>
                  Delete
                </button>
              </>
            )}
            <div style={{ marginTop: '0.5rem' }}>
              <button onClick={() => handleThumb(r._id, 'up')}>
                👍 {counts[r._id]?.thumbsUp || 0}
              </button>
              <button onClick={() => handleThumb(r._id, 'down')}>
                👎 {counts[r._id]?.thumbsDown || 0}
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}

      {user && (
        <>
          <h3>Write a Review</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <textarea
              rows={4}
              value={content}
              onChange={e => setContent(e.target.value)}
              style={{ width: '100%', marginBottom: '0.5rem' }}
              placeholder="Your thoughts…"
            />
            <button type="submit">Submit Review</button>
          </form>
        </>
      )}
    </div>
  )
}
