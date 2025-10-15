import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { ExtensionManager } from '../../extensions/ExtensionManager';

const router = Router();

// GET /api/extensions
router.get('/', async (req: Request, res: Response) => {
  try {
    const extensions = await ExtensionManager.listExtensions();
    res.json(extensions);
  } catch (error) {
    console.error('Error listing extensions:', error);
    res.status(500).json({ error: 'Failed to list extensions' });
  }
});

// GET /api/extensions/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const extension = await ExtensionManager.getExtension(req.params.id);
    if (!extension) {
      return res.status(404).json({ error: 'Extension not found' });
    }
    res.json(extension);
  } catch (error) {
    console.error('Error getting extension:', error);
    res.status(500).json({ error: 'Failed to get extension' });
  }
});

// POST /api/extensions/:id/enable
router.post('/:id/enable', async (req: Request, res: Response) => {
  try {
    await ExtensionManager.enableExtension(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error enabling extension:', error);
    res.status(500).json({ error: 'Failed to enable extension' });
  }
});

// POST /api/extensions/:id/disable
router.post('/:id/disable', async (req: Request, res: Response) => {
  try {
    await ExtensionManager.disableExtension(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error disabling extension:', error);
    res.status(500).json({ error: 'Failed to disable extension' });
  }
});

// POST /api/extensions/install
router.post('/install', async (req: Request, res: Response) => {
  try {
    const { name, version } = req.body;
    const extension = await ExtensionManager.installExtension(name, version);
    res.status(201).json(extension);
  } catch (error) {
    console.error('Error installing extension:', error);
    res.status(500).json({ error: 'Failed to install extension' });
  }
});

// DELETE /api/extensions/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await ExtensionManager.uninstallExtension(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error uninstalling extension:', error);
    res.status(500).json({ error: 'Failed to uninstall extension' });
  }
});

export { router as ExtensionRouter };
