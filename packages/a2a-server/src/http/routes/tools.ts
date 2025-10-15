import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { ToolManager } from '../../tools/ToolManager';

const router = Router();

// GET /api/tools
router.get('/', async (req: Request, res: Response) => {
  try {
    const tools = await ToolManager.listTools();
    res.json(tools);
  } catch (error) {
    console.error('Error listing tools:', error);
    res.status(500).json({ error: 'Failed to list tools' });
  }
});

// GET /api/tools/:name
router.get('/:name', async (req: Request, res: Response) => {
  try {
    const tool = await ToolManager.getToolInfo(req.params.name);
    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    res.json(tool);
  } catch (error) {
    console.error('Error getting tool info:', error);
    res.status(500).json({ error: 'Failed to get tool info' });
  }
});

// POST /api/tools/:name/execute
router.post('/:name/execute', async (req: Request, res: Response) => {
  try {
    const result = await ToolManager.executeTool(req.params.name, req.body);
    res.json(result);
  } catch (error) {
    console.error('Error executing tool:', error);
    res.status(500).json({
      error: 'Failed to execute tool',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/tools/:name/schema
router.get('/:name/schema', async (req: Request, res: Response) => {
  try {
    const schema = await ToolManager.getToolSchema(req.params.name);
    if (!schema) {
      return res.status(404).json({ error: 'Tool schema not found' });
    }
    res.json(schema);
  } catch (error) {
    console.error('Error getting tool schema:', error);
    res.status(500).json({ error: 'Failed to get tool schema' });
  }
});

export { router as ToolRouter };
