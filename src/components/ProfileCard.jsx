import React from 'react';

function ProfileCard({ profile, onEdit, onDelete, onExport }) {
  return (
    <div className="profile-card">
      <h3>{profile.name}</h3>
      <p>{profile.description || 'No description'}</p>
      
      <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '10px' }}>
        <div>Temperature: {profile.temperature}</div>
        <div>Max Tokens: {profile.maxTokens}</div>
        <div>Updated: {new Date(profile.updatedAt).toLocaleDateString()}</div>
      </div>

      {profile.systemInstructions && (
        <div style={{
          background: '#f8f9fa',
          padding: '10px',
          borderRadius: '6px',
          marginBottom: '10px',
          fontSize: '0.85rem'
        }}>
          <strong>System Instructions:</strong>
          <p style={{ marginTop: '5px', whiteSpace: 'pre-wrap' }}>
            {profile.systemInstructions.substring(0, 100)}
            {profile.systemInstructions.length > 100 ? '...' : ''}
          </p>
        </div>
      )}

      <div className="card-actions">
        <button className="button" onClick={onEdit}>
          ✏️ Edit
        </button>
        <button className="button button-success" onClick={onExport}>
          📥 Export
        </button>
        <button className="button button-danger" onClick={onDelete}>
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

export default ProfileCard;
