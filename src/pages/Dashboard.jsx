import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileCard from '../components/ProfileCard';
import ProfileModal from '../components/ProfileModal';

function Dashboard() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/profiles');
      setProfiles(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load profiles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = () => {
    setEditingProfile(null);
    setShowModal(true);
  };

  const handleEditProfile = (profile) => {
    setEditingProfile(profile);
    setShowModal(true);
  };

  const handleDeleteProfile = async (id) => {
    if (!window.confirm('Are you sure you want to delete this profile?')) {
      return;
    }

    try {
      await axios.delete(`/api/profiles/${id}`);
      fetchProfiles();
    } catch (err) {
      setError('Failed to delete profile');
      console.error(err);
    }
  };

  const handleExportProfile = async (id) => {
    try {
      const response = await axios.get(`/api/profiles/${id}/export`);
      const dataStr = JSON.stringify(response.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `gpt-profile-${id}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export profile');
      console.error(err);
    }
  };

  const handleSaveProfile = async (profileData) => {
    try {
      if (editingProfile) {
        await axios.put(`/api/profiles/${editingProfile.id}`, profileData);
      } else {
        await axios.post('/api/profiles', profileData);
      }
      setShowModal(false);
      fetchProfiles();
      setError(null);
    } catch (err) {
      setError('Failed to save profile');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading">Loading profiles...</div>;
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}
      
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>GPT Profiles</h2>
            <p style={{ color: '#666', marginTop: '8px' }}>
              Create, manage, and export custom AI model configurations
            </p>
          </div>
          <button className="button" onClick={handleCreateProfile}>
            ➕ New Profile
          </button>
        </div>
      </div>

      {profiles.length === 0 ? (
        <div className="empty-state">
          <h3>No profiles yet</h3>
          <p>Create your first GPT profile to get started!</p>
          <button className="button" onClick={handleCreateProfile}>
            Create Profile
          </button>
        </div>
      ) : (
        <div className="grid">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onEdit={() => handleEditProfile(profile)}
              onDelete={() => handleDeleteProfile(profile.id)}
              onExport={() => handleExportProfile(profile.id)}
            />
          ))}
        </div>
      )}

      {showModal && (
        <ProfileModal
          profile={editingProfile}
          onSave={handleSaveProfile}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;
