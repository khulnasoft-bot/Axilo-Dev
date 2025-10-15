export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3001,
  environment: process.env.NODE_ENV || 'development',

  // AI Model Configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    defaultModel: process.env.OPENAI_DEFAULT_MODEL || 'gpt-4',
  },

  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    defaultModel: process.env.ANTHROPIC_DEFAULT_MODEL || 'claude-3-sonnet-20240229',
  },

  google: {
    apiKey: process.env.GOOGLE_AI_API_KEY,
    defaultModel: process.env.GOOGLE_DEFAULT_MODEL || 'gemini-pro',
  },

  // Google Cloud Storage Configuration
  gcs: {
    projectId: process.env.GCS_PROJECT_ID,
    keyFilename: process.env.GCS_KEY_FILENAME,
    bucketName: process.env.GCS_BUCKET_NAME || 'axilo-storage',
  },

  // Security
  jwtSecret: process.env.JWT_SECRET || 'axilo-secret-key-change-in-production',

  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // limit each IP to 100 requests per windowMs
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
  },

  // Extensions
  extensions: {
    enabled: process.env.EXTENSIONS_ENABLED !== 'false',
    directory: process.env.EXTENSIONS_DIR || './extensions',
  },

  // Tools
  tools: {
    webSearch: {
      enabled: process.env.WEB_SEARCH_ENABLED !== 'false',
      apiKey: process.env.WEB_SEARCH_API_KEY,
      engine: process.env.WEB_SEARCH_ENGINE || 'google',
    },
    fileSystem: {
      enabled: process.env.FILE_SYSTEM_ENABLED !== 'false',
      allowedPaths: process.env.ALLOWED_FILE_PATHS?.split(',') || [],
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
    },
  },

  // Memory
  memory: {
    maxContextLength: parseInt(process.env.MAX_CONTEXT_LENGTH || '4096'),
    maxMessages: parseInt(process.env.MAX_MESSAGES || '100'),
    persistenceEnabled: process.env.MEMORY_PERSISTENCE !== 'false',
  },

  // Sandbox
  sandbox: {
    enabled: process.env.SANDBOX_ENABLED !== 'false',
    timeout: parseInt(process.env.SANDBOX_TIMEOUT || '30000'), // 30 seconds
    memoryLimit: process.env.SANDBOX_MEMORY_LIMIT || '128MB',
  },
};
