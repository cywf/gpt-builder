import React, { useState, useEffect } from 'react';

function ProfileModal({ profile, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    systemInstructions: '',
    initiationPrompt: '',
    temperature: 0.7,
    maxTokens: 2000
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        description: profile.description,
        systemInstructions: profile.systemInstructions,
        initiationPrompt: profile.initiationPrompt,
        temperature: profile.temperature,
        maxTokens: profile.maxTokens
      });
    }
  }, [profile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{profile ? 'Edit Profile' : 'Create New Profile'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              placeholder="e.g., Code Assistant"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows="3"
              placeholder="Brief description of this GPT profile..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">System Instructions *</label>
            <textarea
              className="form-textarea"
              value={formData.systemInstructions}
              onChange={(e) => handleChange('systemInstructions', e.target.value)}
              required
              rows="6"
              placeholder="Enter the system instructions that define how this AI model should behave..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Initiation Prompt</label>
            <textarea
              className="form-textarea"
              value={formData.initiationPrompt}
              onChange={(e) => handleChange('initiationPrompt', e.target.value)}
              rows="4"
              placeholder="The first message the AI should send when starting a conversation..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Temperature: {formData.temperature}
            </label>
            <input
              type="range"
              className="slider"
              min="0"
              max="2"
              step="0.1"
              value={formData.temperature}
              onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
            />
            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>
              Lower values make the output more focused and deterministic. Higher values make it more creative.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">
              Max Tokens: {formData.maxTokens}
            </label>
            <input
              type="range"
              className="slider"
              min="100"
              max="4000"
              step="100"
              value={formData.maxTokens}
              onChange={(e) => handleChange('maxTokens', parseInt(e.target.value))}
            />
            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>
              Maximum length of the response. Higher values allow longer responses.
            </p>
          </div>

          <div className="modal-actions">
            <button type="button" className="button button-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button">
              {profile ? 'Update' : 'Create'} Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileModal;
