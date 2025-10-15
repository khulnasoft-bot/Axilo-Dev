import { WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { OpenAI } from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { AgentRequest, AgentResponse, Message, WebSocketMessage, ToolCall, ToolResult } from '../types';
import { config } from '../config';
import { ToolManager } from '../tools/ToolManager';
import { PersistenceManager } from '../persistence/PersistenceManager';

export class AgentExecutor {
  private static openai?: OpenAI;
  private static anthropic?: Anthropic;

  static initialize() {
    if (config.openai.apiKey) {
      this.openai = new OpenAI({
        apiKey: config.openai.apiKey,
      });
    }

    if (config.anthropic.apiKey) {
      this.anthropic = new Anthropic({
        apiKey: config.anthropic.apiKey,
      });
    }
  }

  static async handleWebSocketMessage(ws: WebSocket, message: WebSocketMessage) {
    switch (message.type) {
      case 'chat':
        await this.handleChatMessage(ws, message.payload);
        break;
      case 'execute-tool':
        await this.handleToolExecution(ws, message.payload);
        break;
      default:
        ws.send(JSON.stringify({
          type: 'error',
          error: `Unknown message type: ${message.type}`,
          id: message.id,
        }));
    }
  }

  private static async handleChatMessage(ws: WebSocket, payload: AgentRequest) {
    try {
      const conversationId = payload.conversationId || uuidv4();
      const model = payload.model || config.openai.defaultModel;

      // Load conversation history if it exists
      let conversation = await PersistenceManager.loadConversation(conversationId);
      if (!conversation) {
        conversation = {
          id: conversationId,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      // Add new user message
      const userMessage: Message = {
        id: uuidv4(),
        role: 'user',
        content: payload.messages[payload.messages.length - 1]?.content || '',
        timestamp: new Date(),
      };
      conversation.messages.push(userMessage);

      // Execute tools if requested
      if (payload.tools?.length) {
        const toolResults = await this.executeTools(payload.tools, conversation.messages);
        // Add tool results to conversation context
        conversation.messages.push(...toolResults.map(result => ({
          id: uuidv4(),
          role: 'system' as const,
          content: `Tool result: ${JSON.stringify(result.result)}`,
          timestamp: new Date(),
          metadata: { toolResult: result },
        })));
      }

      // Generate AI response
      const response = await this.generateResponse(model, conversation.messages, payload);

      // Add assistant response to conversation
      conversation.messages.push(response.message);
      conversation.updatedAt = new Date();

      // Save conversation
      await PersistenceManager.saveConversation(conversation);

      // Send response back to client
      ws.send(JSON.stringify({
        type: 'chat-response',
        payload: response,
        id: uuidv4(),
      }));

    } catch (error) {
      console.error('Error handling chat message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        id: uuidv4(),
      }));
    }
  }

  private static async handleToolExecution(ws: WebSocket, payload: { tool: string; args: any }) {
    try {
      const result = await ToolManager.executeTool(payload.tool, payload.args);

      ws.send(JSON.stringify({
        type: 'tool-result',
        payload: result,
        id: uuidv4(),
      }));
    } catch (error) {
      console.error('Error executing tool:', error);
      ws.send(JSON.stringify({
        type: 'error',
        error: error instanceof Error ? error.message : 'Tool execution failed',
        id: uuidv4(),
      }));
    }
  }

  private static async executeTools(tools: string[], messages: Message[]): Promise<ToolResult[]> {
    const results: ToolResult[] = [];

    for (const toolName of tools) {
      try {
        const result = await ToolManager.executeTool(toolName, { messages });
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }

  private static async generateResponse(model: string, messages: Message[], options: AgentRequest): Promise<AgentResponse> {
    const conversationId = uuidv4();

    // Format messages for AI API
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    let response: any;

    if (model.startsWith('gpt')) {
      if (!this.openai) {
        throw new Error('OpenAI client not initialized');
      }

      const completion = await this.openai.chat.completions.create({
        model,
        messages: formattedMessages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1000,
        stream: options.stream || false,
      });

      response = completion.choices[0]?.message?.content || '';
    } else if (model.startsWith('claude')) {
      if (!this.anthropic) {
        throw new Error('Anthropic client not initialized');
      }

      const completion = await this.anthropic.messages.create({
        model,
        messages: formattedMessages,
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7,
      });

      response = completion.content[0]?.text || '';
    } else {
      throw new Error(`Unsupported model: ${model}`);
    }

    const assistantMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    return {
      conversationId,
      message: assistantMessage,
      usage: {
        promptTokens: 0, // Would need to get from API response
        completionTokens: 0,
        totalTokens: 0,
      },
    };
  }
}
