/**
 * Конфигурация Sovereign AI для проекта
 * Обеспечивает работу без внешних интеграций
 */

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export const AI_CONFIG = {
  useMock: process.env.AI_USE_MOCK !== 'false',
  localEndpoint: process.env.LOCAL_AI_ENDPOINT || 'http://localhost:11434/api',
  modelName: process.env.LOCAL_MODEL_NAME || 'llama3',
};

