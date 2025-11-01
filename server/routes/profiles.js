const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const PROFILES_FILE = path.join(DATA_DIR, 'profiles.json');

// Ensure data directory exists
const ensureDataDir = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(PROFILES_FILE);
    } catch {
      await fs.writeFile(PROFILES_FILE, JSON.stringify([]));
    }
  } catch (error) {
    console.error('Error ensuring data directory:', error);
  }
};

// Get all profiles
router.get('/', async (req, res) => {
  try {
    await ensureDataDir();
    const data = await fs.readFile(PROFILES_FILE, 'utf8');
    const profiles = JSON.parse(data);
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read profiles' });
  }
});

// Get a single profile
router.get('/:id', async (req, res) => {
  try {
    await ensureDataDir();
    const data = await fs.readFile(PROFILES_FILE, 'utf8');
    const profiles = JSON.parse(data);
    const profile = profiles.find(p => p.id === req.params.id);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read profile' });
  }
});

// Create a new profile
router.post('/', async (req, res) => {
  try {
    await ensureDataDir();
    const data = await fs.readFile(PROFILES_FILE, 'utf8');
    const profiles = JSON.parse(data);
    
    const newProfile = {
      id: Date.now().toString(),
      name: req.body.name || 'Untitled GPT',
      description: req.body.description || '',
      systemInstructions: req.body.systemInstructions || '',
      initiationPrompt: req.body.initiationPrompt || '',
      temperature: req.body.temperature || 0.7,
      maxTokens: req.body.maxTokens || 2000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    profiles.push(newProfile);
    await fs.writeFile(PROFILES_FILE, JSON.stringify(profiles, null, 2));
    
    res.status(201).json(newProfile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

// Update a profile
router.put('/:id', async (req, res) => {
  try {
    await ensureDataDir();
    const data = await fs.readFile(PROFILES_FILE, 'utf8');
    const profiles = JSON.parse(data);
    const index = profiles.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    profiles[index] = {
      ...profiles[index],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };
    
    await fs.writeFile(PROFILES_FILE, JSON.stringify(profiles, null, 2));
    res.json(profiles[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Delete a profile
router.delete('/:id', async (req, res) => {
  try {
    await ensureDataDir();
    const data = await fs.readFile(PROFILES_FILE, 'utf8');
    let profiles = JSON.parse(data);
    const index = profiles.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    profiles = profiles.filter(p => p.id !== req.params.id);
    await fs.writeFile(PROFILES_FILE, JSON.stringify(profiles, null, 2));
    
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete profile' });
  }
});

// Export a profile
router.get('/:id/export', async (req, res) => {
  try {
    await ensureDataDir();
    const data = await fs.readFile(PROFILES_FILE, 'utf8');
    const profiles = JSON.parse(data);
    const profile = profiles.find(p => p.id === req.params.id);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    const exportData = {
      name: profile.name,
      description: profile.description,
      systemInstructions: profile.systemInstructions,
      initiationPrompt: profile.initiationPrompt,
      temperature: profile.temperature,
      maxTokens: profile.maxTokens,
      exportedAt: new Date().toISOString()
    };
    
    res.json(exportData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export profile' });
  }
});

module.exports = router;
