import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { AgentRequest, AgentResponse, Conversation } from '../../types';
import { AgentExecutor } from '../../agent/AgentExecutor';
import { PersistenceManager } from '../../persistence/PersistenceManager';

const router = Router();

// Validation schemas
const ChatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
  })),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().positive().optional(),
  tools: z.array(z.string()).optional(),
});

const ConversationSchema = z.object({
  title: z.string().optional(),
});

// GET /api/agent/conversations
router.get('/conversations', async (req: Request, res: Response) => {
  try {
    const conversations = await PersistenceManager.listConversations();
    res.json(conversations);
  } catch (error) {
    console.error('Error listing conversations:', error);
    res.status(500).json({ error: 'Failed to list conversations' });
  }
});

// GET /api/agent/conversations/:id
router.get('/conversations/:id', async (req: Request, res: Response) => {
  try {
    const conversation = await PersistenceManager.loadConversation(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(conversation);
  } catch (error) {
    console.error('Error loading conversation:', error);
    res.status(500).json({ error: 'Failed to load conversation' });
  }
});

// POST /api/agent/chat
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const validatedData = ChatRequestSchema.parse(req.body);
    const conversationId = uuidv4();

    const agentRequest: AgentRequest = {
      conversationId,
      messages: validatedData.messages.map(msg => ({
        id: uuidv4(),
        ...msg,
        timestamp: new Date(),
      })),
      model: validatedData.model,
      temperature: validatedData.temperature,
      maxTokens: validatedData.maxTokens,
      tools: validatedData.tools,
    };

    // For HTTP API, we'll simulate the response
    // In a real implementation, this would integrate with the WebSocket handler
    const mockResponse: AgentResponse = {
      conversationId,
      message: {
        id: uuidv4(),
        role: 'assistant',
        content: 'This is a mock response from the HTTP API. For real AI chat, use the WebSocket connection.',
        timestamp: new Date(),
      },
    };

    res.json(mockResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request data', details: error.errors });
    } else {
      console.error('Error in chat endpoint:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// POST /api/agent/conversations
router.post('/conversations', async (req: Request, res: Response) => {
  try {
    const validatedData = ConversationSchema.parse(req.body);
    const conversation: Conversation = {
      id: uuidv4(),
      title: validatedData.title,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await PersistenceManager.saveConversation(conversation);
    res.status(201).json(conversation);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request data', details: error.errors });
    } else {
      console.error('Error creating conversation:', error);
      res.status(500).json({ error: 'Failed to create conversation' });
    }
  }
});

// DELETE /api/agent/conversations/:id
router.delete('/conversations/:id', async (req: Request, res: Response) => {
  try {
    await PersistenceManager.deleteConversation(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});

export { router as AgentRouter };
