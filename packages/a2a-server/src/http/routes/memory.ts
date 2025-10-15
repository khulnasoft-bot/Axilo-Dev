import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { PersistenceManager } from '../../persistence/PersistenceManager';

const router = Router();

// GET /api/memory/conversations
router.get('/conversations', async (req: Request, res: Response) => {
  try {
    const conversations = await PersistenceManager.listConversations();
    res.json(conversations);
  } catch (error) {
    console.error('Error listing conversations:', error);
    res.status(500).json({ error: 'Failed to list conversations' });
  }
});

// GET /api/memory/conversations/:id/messages
router.get('/conversations/:id/messages', async (req: Request, res: Response) => {
  try {
    const conversation = await PersistenceManager.loadConversation(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(conversation.messages);
  } catch (error) {
    console.error('Error loading conversation messages:', error);
    res.status(500).json({ error: 'Failed to load conversation messages' });
  }
});

// POST /api/memory/conversations/:id/messages
router.post('/conversations/:id/messages', async (req: Request, res: Response) => {
  try {
    const { role, content } = req.body;
    const conversation = await PersistenceManager.loadConversation(req.params.id);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const newMessage = {
      id: require('uuid').v4(),
      role,
      content,
      timestamp: new Date(),
    };

    conversation.messages.push(newMessage);
    conversation.updatedAt = new Date();

    await PersistenceManager.saveConversation(conversation);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ error: 'Failed to add message' });
  }
});

// DELETE /api/memory/conversations/:id
router.delete('/conversations/:id', async (req: Request, res: Response) => {
  try {
    await PersistenceManager.deleteConversation(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});

// GET /api/memory/stats
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await PersistenceManager.getMemoryStats();
    res.json(stats);
  } catch (error) {
    console.error('Error getting memory stats:', error);
    res.status(500).json({ error: 'Failed to get memory stats' });
  }
});

export { router as MemoryRouter };
