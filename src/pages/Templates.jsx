import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    systemInstructions: '',
    initiationPrompt: '',
    category: 'general',
    isPublic: false,
    author: ''
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/templates');
      setTemplates(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load templates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTemplate) {
        await axios.put(`/api/templates/${editingTemplate.id}`, formData);
      } else {
        await axios.post('/api/templates', formData);
      }
      setShowForm(false);
      setEditingTemplate(null);
      setFormData({
        name: '',
        description: '',
        systemInstructions: '',
        initiationPrompt: '',
        category: 'general',
        isPublic: false,
        author: ''
      });
      fetchTemplates();
      setError(null);
    } catch (err) {
      setError('Failed to save template');
      console.error(err);
    }
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description,
      systemInstructions: template.systemInstructions,
      initiationPrompt: template.initiationPrompt,
      category: template.category,
      isPublic: template.isPublic,
      author: template.author
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      await axios.delete(`/api/templates/${id}`);
      fetchTemplates();
    } catch (err) {
      setError('Failed to delete template');
      console.error(err);
    }
  };

  const handleUseTemplate = async (template) => {
    try {
      const profileData = {
        name: `${template.name} (from template)`,
        description: template.description,
        systemInstructions: template.systemInstructions,
        initiationPrompt: template.initiationPrompt
      };
      await axios.post('/api/profiles', profileData);
      alert('Profile created from template! Check your dashboard.');
    } catch (err) {
      setError('Failed to create profile from template');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTemplate(null);
    setFormData({
      name: '',
      description: '',
      systemInstructions: '',
      initiationPrompt: '',
      category: 'general',
      isPublic: false,
      author: ''
    });
  };

  if (loading) {
    return <div className="loading">Loading templates...</div>;
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Templates</h2>
            <p style={{ color: '#666', marginTop: '8px' }}>
              Share and use pre-configured GPT templates
            </p>
          </div>
          <button
            className="button"
            onClick={() => setShowForm(true)}
            disabled={showForm}
          >
            ➕ New Template
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card">
          <h3>{editingTemplate ? 'Edit Template' : 'Create New Template'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows="3"
              />
            </div>

            <div className="form-group">
              <label className="form-label">System Instructions</label>
              <textarea
                className="form-textarea"
                value={formData.systemInstructions}
                onChange={(e) => setFormData({ ...formData, systemInstructions: e.target.value })}
                required
                rows="5"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Initiation Prompt</label>
              <textarea
                className="form-textarea"
                value={formData.initiationPrompt}
                onChange={(e) => setFormData({ ...formData, initiationPrompt: e.target.value })}
                rows="4"
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
                <option value="business">Business</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Author</label>
              <input
                type="text"
                className="form-input"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Your name or handle"
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  style={{ marginRight: '8px' }}
                />
                <span className="form-label" style={{ marginBottom: 0 }}>
                  Make this template public (share with community)
                </span>
              </label>
            </div>

            <div className="modal-actions">
              <button type="button" className="button button-secondary" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="button">
                {editingTemplate ? 'Update' : 'Create'} Template
              </button>
            </div>
          </form>
        </div>
      )}

      {templates.length === 0 ? (
        <div className="empty-state">
          <h3>No templates yet</h3>
          <p>Create your first template to get started!</p>
        </div>
      ) : (
        <div className="grid">
          {templates.map((template) => (
            <div key={template.id} className="card">
              <h3 style={{ color: '#667eea', marginBottom: '10px' }}>
                {template.name}
                {template.isPublic && (
                  <span style={{ marginLeft: '8px', fontSize: '0.8rem', color: '#28a745' }}>
                    🌐 Public
                  </span>
                )}
              </h3>
              <p style={{ color: '#666', marginBottom: '10px', fontSize: '0.9rem' }}>
                Category: {template.category} | By: {template.author}
              </p>
              <p style={{ color: '#333', marginBottom: '15px' }}>
                {template.description}
              </p>
              <div className="card-actions">
                <button
                  className="button button-success"
                  onClick={() => handleUseTemplate(template)}
                >
                  Use Template
                </button>
                <button
                  className="button"
                  onClick={() => handleEdit(template)}
                >
                  Edit
                </button>
                <button
                  className="button button-danger"
                  onClick={() => handleDelete(template.id)}
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

export default Templates;
