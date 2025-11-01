const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const PROMPTS_FILE = path.join(DATA_DIR, 'prompts.json');

// Ensure data directory exists
const ensureDataDir = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(PROMPTS_FILE);
    } catch {
      await fs.writeFile(PROMPTS_FILE, JSON.stringify([]));
    }
  } catch (error) {
    console.error('Error ensuring data directory:', error);
  }
};

// Get all prompts
router.get('/', async (req, res) => {
  try {
    await ensureDataDir();
    const data = await fs.readFile(PROMPTS_FILE, 'utf8');
    const prompts = JSON.parse(data);
    res.json(prompts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read prompts' });
  }
});

// Create a new prompt
router.post('/', async (req, res) => {
  try {
    await ensureDataDir();
    const data = await fs.readFile(PROMPTS_FILE, 'utf8');
    const prompts = JSON.parse(data);
    
    const newPrompt = {
      id: Date.now().toString(),
      title: req.body.title || 'Untitled Prompt',
      content: req.body.content || '',
      category: req.body.category || 'general',
      tags: req.body.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    prompts.push(newPrompt);
    await fs.writeFile(PROMPTS_FILE, JSON.stringify(prompts, null, 2));
    
    res.status(201).json(newPrompt);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create prompt' });
  }
});

// Update a prompt
router.put('/:id', async (req, res) => {
  try {
    await ensureDataDir();
    const data = await fs.readFile(PROMPTS_FILE, 'utf8');
    const prompts = JSON.parse(data);
    const index = prompts.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    
    prompts[index] = {
      ...prompts[index],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };
    
    await fs.writeFile(PROMPTS_FILE, JSON.stringify(prompts, null, 2));
    res.json(prompts[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update prompt' });
  }
});

// Delete a prompt
router.delete('/:id', async (req, res) => {
  try {
    await ensureDataDir();
    const data = await fs.readFile(PROMPTS_FILE, 'utf8');
    let prompts = JSON.parse(data);
    
    prompts = prompts.filter(p => p.id !== req.params.id);
    await fs.writeFile(PROMPTS_FILE, JSON.stringify(prompts, null, 2));
    
    res.json({ message: 'Prompt deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete prompt' });
  }
});

module.exports = router;
