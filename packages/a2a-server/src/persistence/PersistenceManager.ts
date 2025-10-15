import { Storage } from '@google-cloud/storage';
import { Conversation, Message } from '../types';
import { config } from '../config';

export class PersistenceManager {
  private static storage: Storage | null = null;
  private static bucketName: string;

  static initialize() {
    if (config.gcs.projectId && config.gcs.keyFilename) {
      this.storage = new Storage({
        projectId: config.gcs.projectId,
        keyFilename: config.gcs.keyFilename,
      });
      this.bucketName = config.gcs.bucketName;
    } else {
      console.warn('GCS not configured, using in-memory storage');
      this.bucketName = 'memory';
    }
  }

  static async saveConversation(conversation: Conversation): Promise<void> {
    if (this.storage) {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(`conversations/${conversation.id}.json`);
      await file.save(JSON.stringify(conversation, null, 2));
    } else {
      // In-memory fallback for development
      const fs = require('fs').promises;
      const path = require('path');
      const dataDir = path.join(process.cwd(), 'data');
      await fs.mkdir(dataDir, { recursive: true });
      await fs.writeFile(
        path.join(dataDir, `conversation-${conversation.id}.json`),
        JSON.stringify(conversation, null, 2)
      );
    }
  }

  static async loadConversation(id: string): Promise<Conversation | null> {
    if (this.storage) {
      try {
        const bucket = this.storage.bucket(this.bucketName);
        const file = bucket.file(`conversations/${id}.json`);
        const [exists] = await file.exists();
        if (!exists) return null;

        const [content] = await file.download();
        return JSON.parse(content.toString());
      } catch (error) {
        console.error('Error loading conversation from GCS:', error);
        return null;
      }
    } else {
      // In-memory fallback for development
      try {
        const fs = require('fs').promises;
        const path = require('path');
        const filePath = path.join(process.cwd(), 'data', `conversation-${id}.json`);
        const content = await fs.readFile(filePath, 'utf8');
        return JSON.parse(content);
      } catch (error) {
        return null;
      }
    }
  }

  static async listConversations(): Promise<Conversation[]> {
    if (this.storage) {
      try {
        const bucket = this.storage.bucket(this.bucketName);
        const [files] = await bucket.getFiles({ prefix: 'conversations/' });
        const conversations: Conversation[] = [];

        for (const file of files) {
          const [content] = await file.download();
          conversations.push(JSON.parse(content.toString()));
        }

        return conversations.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      } catch (error) {
        console.error('Error listing conversations from GCS:', error);
        return [];
      }
    } else {
      // In-memory fallback for development
      try {
        const fs = require('fs').promises;
        const path = require('path');
        const dataDir = path.join(process.cwd(), 'data');

        // Check if data directory exists
        try {
          await fs.access(dataDir);
        } catch {
          return [];
        }

        const files = await fs.readdir(dataDir);
        const conversationFiles = files.filter(f => f.startsWith('conversation-') && f.endsWith('.json'));

        const conversations: Conversation[] = [];
        for (const file of conversationFiles) {
          const content = await fs.readFile(path.join(dataDir, file), 'utf8');
          conversations.push(JSON.parse(content));
        }

        return conversations.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      } catch (error) {
        console.error('Error listing conversations from memory:', error);
        return [];
      }
    }
  }

  static async deleteConversation(id: string): Promise<void> {
    if (this.storage) {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(`conversations/${id}.json`);
      await file.delete();
    } else {
      // In-memory fallback for development
      const fs = require('fs').promises;
      const path = require('path');
      const filePath = path.join(process.cwd(), 'data', `conversation-${id}.json`);
      await fs.unlink(filePath);
    }
  }

  static async getMemoryStats(): Promise<{
    totalConversations: number;
    totalMessages: number;
    storageUsed: string;
  }> {
    const conversations = await this.listConversations();
    const totalMessages = conversations.reduce((sum, conv) => sum + conv.messages.length, 0);

    // Estimate storage used (rough calculation)
    const estimatedSize = JSON.stringify(conversations).length;
    const storageUsed = `${(estimatedSize / 1024 / 1024).toFixed(2)} MB`;

    return {
      totalConversations: conversations.length,
      totalMessages,
      storageUsed,
    };
  }

  static async close(): Promise<void> {
    // Clean up any connections if needed
    if (this.storage) {
      // GCS client doesn't need explicit closing
    }
  }
}
