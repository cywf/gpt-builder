const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const TEMPLATES_FILE = path.join(DATA_DIR, 'templates.json');

// Ensure data directory exists
const ensureDataDir = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(TEMPLATES_FILE);
    } catch {
      await fs.writeFile(TEMPLATES_FILE, JSON.stringify([]));
    }
  } catch (error) {
    console.error('Error ensuring data directory:', error);
  }
};

// Get all templates
router.get('/', async (req, res) => {
  try {
    await ensureDataDir();
    const data = await fs.readFile(TEMPLATES_FILE, 'utf8');
    const templates = JSON.parse(data);
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read templates' });
  }
});

// Create a new template
router.post('/', async (req, res) => {
  try {
    await ensureDataDir();
    const data = await fs.readFile(TEMPLATES_FILE, 'utf8');
    const templates = JSON.parse(data);
    
    const newTemplate = {
      id: Date.now().toString(),
      name: req.body.name || 'Untitled Template',
      description: req.body.description || '',
      systemInstructions: req.body.systemInstructions || '',
      initiationPrompt: req.body.initiationPrompt || '',
      category: req.body.category || 'general',
      isPublic: req.body.isPublic || false,
      author: req.body.author || 'Anonymous',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    templates.push(newTemplate);
    await fs.writeFile(TEMPLATES_FILE, JSON.stringify(templates, null, 2));
    
    res.status(201).json(newTemplate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create template' });
  }
});

// Update a template
router.put('/:id', async (req, res) => {
  try {
    await ensureDataDir();
    const data = await fs.readFile(TEMPLATES_FILE, 'utf8');
    const templates = JSON.parse(data);
    const index = templates.findIndex(t => t.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    templates[index] = {
      ...templates[index],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };
    
    await fs.writeFile(TEMPLATES_FILE, JSON.stringify(templates, null, 2));
    res.json(templates[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update template' });
  }
});

// Delete a template
router.delete('/:id', async (req, res) => {
  try {
    await ensureDataDir();
    const data = await fs.readFile(TEMPLATES_FILE, 'utf8');
    let templates = JSON.parse(data);
    
    templates = templates.filter(t => t.id !== req.params.id);
    await fs.writeFile(TEMPLATES_FILE, JSON.stringify(templates, null, 2));
    
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete template' });
  }
});

module.exports = router;
