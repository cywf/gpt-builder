import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PromptsLibrary() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/prompts');
      setPrompts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load prompts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPrompt) {
        await axios.put(`/api/prompts/${editingPrompt.id}`, formData);
      } else {
        await axios.post('/api/prompts', formData);
      }
      setShowForm(false);
      setEditingPrompt(null);
      setFormData({ title: '', content: '', category: 'general', tags: [] });
      fetchPrompts();
      setError(null);
    } catch (err) {
      setError('Failed to save prompt');
      console.error(err);
    }
  };

  const handleEdit = (prompt) => {
    setEditingPrompt(prompt);
    setFormData({
      title: prompt.title,
      content: prompt.content,
      category: prompt.category,
      tags: prompt.tags || []
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prompt?')) {
      return;
    }

    try {
      await axios.delete(`/api/prompts/${id}`);
      fetchPrompts();
    } catch (err) {
      setError('Failed to delete prompt');
      console.error(err);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPrompt(null);
    setFormData({ title: '', content: '', category: 'general', tags: [] });
  };

  if (loading) {
    return <div className="loading">Loading prompts...</div>;
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Prompts Library</h2>
            <p style={{ color: '#666', marginTop: '8px' }}>
              Store and refine your prompts for reuse
            </p>
          </div>
          <button
            className="button"
            onClick={() => setShowForm(true)}
            disabled={showForm}
          >
            ➕ New Prompt
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card">
          <h3>{editingPrompt ? 'Edit Prompt' : 'Create New Prompt'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea
                className="form-textarea"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows="6"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-input"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="general">General</option>
                <option value="coding">Coding</option>
                <option value="creative">Creative</option>
                <option value="analysis">Analysis</option>
                <option value="education">Education</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tags</label>
              <div className="tag-input-container">
                <input
                  type="text"
                  className="form-input tag-input"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Add a tag and press Enter"
                />
                <button
                  type="button"
                  className="button"
                  onClick={handleAddTag}
                >
                  Add
                </button>
              </div>
              <div style={{ marginTop: '10px' }}>
                {formData.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      style={{
                        marginLeft: '8px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#666'
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="button button-secondary" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="button">
                {editingPrompt ? 'Update' : 'Create'} Prompt
              </button>
            </div>
          </form>
        </div>
      )}

      {prompts.length === 0 ? (
        <div className="empty-state">
          <h3>No prompts yet</h3>
          <p>Create your first prompt to get started!</p>
        </div>
      ) : (
        <div className="grid">
          {prompts.map((prompt) => (
            <div key={prompt.id} className="card">
              <h3 style={{ color: '#667eea', marginBottom: '10px' }}>{prompt.title}</h3>
              <p style={{ color: '#666', marginBottom: '10px', fontSize: '0.9rem' }}>
                Category: {prompt.category}
              </p>
              <p style={{ color: '#333', marginBottom: '15px', whiteSpace: 'pre-wrap' }}>
                {prompt.content.substring(0, 150)}
                {prompt.content.length > 150 ? '...' : ''}
              </p>
              {prompt.tags && prompt.tags.length > 0 && (
                <div style={{ marginBottom: '15px' }}>
                  {prompt.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              )}
              <div className="card-actions">
                <button
                  className="button"
                  onClick={() => handleEdit(prompt)}
                >
                  Edit
                </button>
                <button
                  className="button button-danger"
                  onClick={() => handleDelete(prompt.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PromptsLibrary;
