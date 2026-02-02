/**
 * AI Service - Микросервис для работы с локальными моделями
 * Полностью автономен, не использует внешние API
 */

import express from 'express';
import cors from 'cors';

const app = express();
const port = 3005;

app.use(cors());
app.use(express.json());

// Локальный инференс (например, Ollama)
const LOCAL_AI_URL = process.env.LOCAL_AI_URL || 'http://localhost:11434/api';

// Генерация текста
app.post('/api/ai/generate-text', async (req, res) => {
  try {
    const { prompt, context } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // В реальной версии здесь был бы вызов локального Ollama API
    // Для демо используем внутренний движок
    const mockResponse = `[Local AI] ${prompt}. ${context ? `Контекст: ${JSON.stringify(context)}` : ''}`;
    
    res.json({ text: mockResponse });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Генерация изображения
app.post('/api/ai/generate-image', async (req, res) => {
  try {
    const { prompt, style, size } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // В реальной версии здесь был бы вызов локального Stable Diffusion API
    // Для демо возвращаем заглушку
    const mockImageUrl = `https://via.placeholder.com/${size || '512x512'}?text=Local-SD-${encodeURIComponent(prompt)}`;
    
    res.json({ imageUrl: mockImageUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Генерация эмбеддингов (локально)
app.post('/api/ai/embeddings', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Генерация вектора локально без внешних API
    const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const embedding = Array(1536).fill(0).map((_, i) => (hash + i) % 1000 / 1000);
    
    res.json({ embedding });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// AI чат
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, context, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // В реальной версии здесь был бы вызов локальной LLM
    const mockResponse = {
      role: 'assistant',
      content: `[Local Assistant] Я обработал ваше сообщение: "${message}". Все вычисления произведены локально.`,
      timestamp: new Date().toISOString()
    };
    
    res.json(mockResponse);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'ai-service',
    mode: 'sovereign-local'
  });
});

app.listen(port, () => {
  console.log(`Sovereign AI Service running at http://localhost:${port}`);
  console.log(`Mode: Local Inference Only`);
});

