/**
 * Расширенный AI сервис с поддержкой очередей и пакетной обработки
 */

import { AI_CONFIG } from '../config/ai.config';

export interface AIGenerationTask {
  id: string;
  type: 'text' | 'image' | 'translate';
  prompt: string;
  options?: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

import { KnowledgeService } from './knowledge.service';

import { KnowledgeService } from './knowledge.service';
import { MemoryService } from './memory.service';

export class AdvancedAIService {
  private static taskQueue: AIGenerationTask[] = [];
  private static isProcessing = false;
  private static maxConcurrentTasks = 3;

  /**
   * Генерирует текст с использованием AI
   */
  static async generateText(prompt: string, options?: {
    maxTokens?: number;
    temperature?: number;
    model?: string;
  }): Promise<string> {
    if (AI_CONFIG.useMock || !AI_CONFIG.openaiApiKey) {
      return this.generateMockText(prompt, options);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_CONFIG.openaiApiKey}`,
        },
        body: JSON.stringify({
          model: options?.model || 'gpt-4',
          messages: [
            { role: 'system', content: 'You are a helpful AI assistant for brand content generation.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: options?.maxTokens || 1000,
          temperature: options?.temperature || 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.generateMockText(prompt, options);
    }
  }

  /**
   * Генерирует изображение с использованием AI
   */
  static async generateImage(prompt: string, options?: {
    size?: '256x256' | '512x512' | '1024x1024';
    style?: 'vivid' | 'natural';
  }): Promise<string> {
    if (AI_CONFIG.useMock || !AI_CONFIG.openaiApiKey) {
      return this.generateMockImage(prompt);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_CONFIG.openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: options?.size || '1024x1024',
          style: options?.style || 'natural',
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data[0].url;
    } catch (error) {
      console.error('OpenAI Image API error:', error);
      return this.generateMockImage(prompt);
    }
  }

  /**
   * Переводит текст с использованием AI
   */
  static async translateText(text: string, targetLang: 'ru' | 'en' | 'uk', sourceLang?: string): Promise<string> {
    if (AI_CONFIG.useMock || !AI_CONFIG.openaiApiKey) {
      return this.generateMockTranslation(text, targetLang);
    }

    try {
      const langNames: Record<string, string> = {
        'ru': 'Russian',
        'en': 'English',
        'uk': 'Ukrainian'
      };

      const prompt = `Translate the following text to ${langNames[targetLang]}. 
      ${sourceLang ? `Source language: ${langNames[sourceLang]}` : 'Detect the source language automatically.'}
      
      Text: "${text}"
      
      Provide only the translation, without any additional text.`;

      const response = await this.generateText(prompt, {
        maxTokens: 500,
        temperature: 0.3
      });

      return response.trim();
    } catch (error) {
      console.error('Translation error:', error);
      return this.generateMockTranslation(text, targetLang);
    }
  }

  /**
   * Генерирует контент для блока сайта
   */
  static async generateBlockContent(blockType: string, context: {
    brandName: string;
    niche: string;
    style?: string;
    organizationId?: string;
  }): Promise<any> {
    // RAG: Inject context from knowledge base if available
    let ragContext = '';
    if (context.organizationId) {
      try {
        const relevantChunks = await KnowledgeService.queryContext(context.organizationId, `${context.niche} ${blockType}`);
        if (relevantChunks.length > 0) {
          ragContext = `\nUse the following brand context for generation: ${relevantChunks.join('\n')}`;
        }
      } catch (err) {
        console.error('RAG query failed:', err);
      }
    }

    if (AI_CONFIG.useMock || !AI_CONFIG.openaiApiKey) {
      return { content: this.generateFallbackContent(blockType, context) };
    }

    // Memory: Inject user preferences
    let memoryContext = '';
    try {
      const memories = await MemoryService.getMemory('designer', context.organizationId);
      if (memories.length > 0) {
        memoryContext = `\nUser preferences from memory: ${memories.map(m => `${m.key}: ${m.value}`).join(', ')}`;
      }
    } catch (err) {
      console.error('Memory retrieval failed:', err);
    }

    const prompt = `Generate content for a ${blockType} block on a website for a brand called "${context.brandName}" in the "${context.niche}" niche.${ragContext}${memoryContext}
    Style: ${context.style || 'modern and professional'}
    
    Provide a JSON object with appropriate fields for this block type. Return ONLY the JSON.`;

    const response = await this.generateText(prompt, {
      maxTokens: 800,
      temperature: 0.7
    });

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return { content: JSON.parse(jsonMatch[0]) };
      }
    } catch (error) {
      console.error('Failed to parse AI response as JSON:', error);
    }

    return { content: this.generateFallbackContent(blockType, context) };
  }

  /**
   * Генерирует предложения по улучшению сайта
   */
  static async generateSuggestions(context: {
    brandName: string;
    niche: string;
    existingBlocks: string[];
  }): Promise<string[]> {
    const prompt = `Analyze a website for a brand "${context.brandName}" in the "${context.niche}" niche. 
    Current blocks: ${context.existingBlocks.join(', ')}.
    
    Suggest 3 actionable improvements or missing blocks to increase conversion. 
    Return ONLY a JSON array of strings.`;

    const response = await this.generateText(prompt, {
      maxTokens: 500,
      temperature: 0.7
    });

    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Failed to parse suggestions JSON:', error);
    }

    return [
      `Add a "Testimonials" block to build social proof for ${context.brandName}.`,
      `Include a "FAQ" block to address common customer concerns in ${context.niche}.`,
      `Add a "Pricing" block to show transparency and convert users faster.`
    ];
  }

  /**
   * Генерирует серию постов для соцсетей
   */
  static async generateSocialPosts(count: number, context: {
    brandName: string;
    niche: string;
    platforms: string[];
  }): Promise<Array<{ platform: string; title: string; subtitle?: string; cta?: string }>> {
    const prompt = `Generate ${count} social media posts for a brand called "${context.brandName}" in the "${context.niche}" niche.
    Platforms: ${context.platforms.join(', ')}
    
    Provide a JSON array with objects containing: platform, title, subtitle (optional), cta (optional).
    Make each post unique and engaging.`;

    const response = await this.generateText(prompt, {
      maxTokens: 1500,
      temperature: 0.8
    });

    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Failed to parse AI response as JSON:', error);
    }

    return Array.from({ length: count }, (_, i) => ({
      platform: context.platforms[i % context.platforms.length],
      title: `Post ${i + 1} for ${context.brandName}`,
      subtitle: `Engaging content about ${context.niche}`,
      cta: 'Learn more'
    }));
  }

  /**
   * Добавляет задачу в очередь
   */
  static async queueTask(task: Omit<AIGenerationTask, 'id' | 'status' | 'createdAt'>): Promise<string> {
    const newTask: AIGenerationTask = {
      ...task,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      createdAt: new Date()
    };

    this.taskQueue.push(newTask);
    this.processQueue();

    return newTask.id;
  }

  /**
   * Получает статус задачи
   */
  static getTaskStatus(taskId: string): AIGenerationTask | null {
    return this.taskQueue.find(t => t.id === taskId) || null;
  }

  /**
   * Обрабатывает очередь задач
   */
  private static async processQueue() {
    if (this.isProcessing) return;

    const pendingTasks = this.taskQueue.filter(t => t.status === 'pending');
    if (pendingTasks.length === 0) return;

    this.isProcessing = true;

    const tasksToProcess = pendingTasks.slice(0, this.maxConcurrentTasks);
    
    await Promise.all(tasksToProcess.map(task => this.processTask(task)));

    this.isProcessing = false;

    if (this.taskQueue.some(t => t.status === 'pending')) {
      setTimeout(() => this.processQueue(), 100);
    }
  }

  /**
   * Обрабатывает одну задачу
   */
  private static async processTask(task: AIGenerationTask) {
    task.status = 'processing';

    try {
      let result: any;

      switch (task.type) {
        case 'text':
          result = await this.generateText(task.prompt, task.options);
          break;
        case 'image':
          result = await this.generateImage(task.prompt, task.options);
          break;
        case 'translate':
          result = await this.translateText(task.prompt, task.options?.targetLang || 'en');
          break;
        default:
          throw new Error(`Unknown task type: ${task.type}`);
      }

      task.result = result;
      task.status = 'completed';
      task.completedAt = new Date();
    } catch (error: any) {
      task.status = 'failed';
      task.error = error.message;
      task.completedAt = new Date();
    }
  }

  private static generateMockText(prompt: string, options?: any): string {
    const mockResponses: Record<string, string> = {
      'hero': 'Добро пожаловать в наш бренд! Мы предлагаем инновационные решения для вашего бизнеса.',
      'features': 'Наши преимущества: качество, скорость, надежность и инновации.',
      'testimonials': 'Наши клиенты довольны нашими услугами и рекомендуют нас своим друзьям.',
    };

    for (const key in mockResponses) {
      if (prompt.toLowerCase().includes(key)) {
        return mockResponses[key];
      }
    }

    return `[AI Generated] Content for ${prompt.substring(0, 50)}... This is a mock response.`;
  }

  private static generateMockImage(prompt: string): string {
    const encodedPrompt = encodeURIComponent(prompt.substring(0, 50));
    return `https://via.placeholder.com/1024x1024/2563eb/ffffff?text=${encodedPrompt}`;
  }

  private static generateMockTranslation(text: string, targetLang: string): string {
    const prefix = targetLang === 'ru' ? '[RU]' : targetLang === 'en' ? '[EN]' : '[UK]';
    return `${prefix} ${text}`;
  }

  private static generateFallbackContent(blockType: string, context: any): any {
    const brand = context.brandName || 'Our Brand';
    const niche = context.niche || 'innovation';

    const fallbacks: Record<string, any> = {
      'header': {
        logo: brand,
        links: ['Home', 'Services', 'Pricing', 'FAQ']
      },
      'hero': {
        title: `Transforming ${niche} with ${brand}`,
        subtitle: `Experience the next generation of solutions tailored for your business needs.`
      },
      'features': {
        title: 'Core Benefits',
        items: [
          { title: 'AI Driven', description: 'Advanced algorithms at your service.', icon: 'Sparkles' },
          { title: 'Cloud Scale', description: 'Grow without limits.', icon: 'Box' },
          { title: 'Secure', description: 'Enterprise-grade protection.', icon: 'Shield' }
        ]
      },
      'pricing': {
        title: 'Flexible Plans',
        plans: [
          { name: 'Starter', price: '29', features: ['Basic Analytics', '1 User'], popular: false },
          { name: 'Pro', price: '79', features: ['Advanced Analytics', '5 Users', 'Priority Support'], popular: true }
        ]
      },
      'faq': {
        title: 'Got Questions?',
        items: [
          { question: `What is ${brand}?`, answer: `We are a leading provider in ${niche} niche.` },
          { question: 'How to get started?', answer: 'Simply sign up and choose your plan.' }
        ]
      },
      'stats': {
        items: [
          { label: 'Active Users', value: '50k+' },
          { label: 'Satisfaction', value: '99%' }
        ]
      },
      'testimonials': {
        title: 'Trusted by Leaders',
        items: [
          { text: 'Unbelievable results!', author: 'Alex Rivera', role: 'CTO' },
          { text: 'The best in the market.', author: 'Sarah Jenkins', role: 'CEO' }
        ]
      }
    };

    return fallbacks[blockType.toLowerCase()] || { title: `New ${blockType}`, content: `AI generated content for ${niche}` };
  }

  // ========== BULK CONTENT AUTOPILOT ==========

  static async bulkGenerateBlogPosts(projectId: string, niche: string, count: number = 5): Promise<any[]> {
    if (AI_CONFIG.useMock) {
      const posts = [];
      for (let i = 0; i < count; i++) {
        const title = `The Future of ${niche} - Part ${i + 1}`;
        posts.push({
          title,
          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          excerpt: `Exploring the impact of ${niche} on modern society and business.`,
          content: `# ${title}\n\nThis is a deep dive into ${niche}.\n\n## Why it matters\nIt's changing everything we know about the industry.`,
          imageUrl: `https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80&sig=${i}`,
          isPublished: true,
          publishedAt: new Date()
        });
      }
      return posts;
    }
    return [];
  }

  static async generateProductCopy(productName: string, features: string[]): Promise<string> {
    if (AI_CONFIG.useMock) {
      return `Experience the revolutionary ${productName}. Featuring ${features.join(', ')}, this product is designed to elevate your lifestyle and provide unparalleled performance. Order now and join the future!`;
    }
    return '';
  }

  static async generateSocialBanner(projectId: string, type: 'sale' | 'new_arrival' | 'welcome', text: string): Promise<string> {
    if (AI_CONFIG.useMock) {
      const baseUrl = 'https://via.placeholder.com/1200x628';
      const colors = ['FF0000', '00FF00', '0000FF', 'FFFF00', 'FF00FF', '00FFFF'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const encodedText = encodeURIComponent(text || type.replace('_', ' ').toUpperCase());
      return `${baseUrl}/${randomColor}/FFFFFF?text=${encodedText}`;
    }
    return '';
  }

  static async generateSocialCaption(projectId: string, context: string, tone: string): Promise<string> {
    if (AI_CONFIG.useMock) {
      return `🎉 Exciting news! ${context}. Get ready to experience the future with us! #Innovation #${tone} #NewRelease`;
    }
    return '';
  }

  static async synthesizeComponent(description: string, brandContext: any): Promise<string> {
    if (AI_CONFIG.useMock) {
      return `<div class="p-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[48px] text-white text-center space-y-8 shadow-2xl">
        <h2 class="text-5xl font-black leading-tight">Generated for ${brandContext.brandName}</h2>
        <p class="text-xl text-blue-100 max-w-2xl mx-auto">${description}</p>
        <div class="flex justify-center gap-4">
          <button class="px-8 py-4 bg-white text-blue-600 rounded-2xl font-black hover:scale-105 transition-all">Action Primary</button>
          <button class="px-8 py-4 border-2 border-white/20 text-white rounded-2xl font-black hover:bg-white/10 transition-all">Action Secondary</button>
        </div>
      </div>`;
    }

    const prompt = `Synthesize a high-quality website section using Tailwind CSS and HTML.
    Description: ${description}
    Brand: ${brandContext.brandName}
    Niche: ${brandContext.niche}
    
    Return ONLY the HTML code within <div>. Use modern design, rounded corners, and accessibility best practices.`;

    const response = await this.generateText(prompt, { maxTokens: 1500 });
    return response;
  }

  static async generateImageVariants(prompt: string, count: number = 4): Promise<string[]> {
    if (AI_CONFIG.useMock) {
      return Array.from({ length: count }, (_, i) => `https://via.placeholder.com/1024x1024/2563eb/ffffff?text=Variant+${i + 1}`);
    }
    // Real DALL-E logic
    return [];
  }

  static async generateLogo(brandName: string, personality: string): Promise<string> {
    if (AI_CONFIG.useMock) {
      return `https://via.placeholder.com/512x512/000000/ffffff?text=${encodeURIComponent(brandName)}+Logo`;
    }
    // Real logo generation logic
    return '';
  }

  static async generateSVGPattern(vibe: string): Promise<string> {
    if (AI_CONFIG.useMock) {
      // Return a simple mock SVG pattern
      return `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="p" patternUnits="userSpaceOnUse" width="20" height="20"><circle cx="10" cy="10" r="2" fill="#2563eb" opacity="0.2"/></pattern></defs><rect width="100%" height="100%" fill="url(#p)"/></svg>`;
    }
    
    const prompt = `Generate a modern, minimalist SVG background pattern. Vibe: ${vibe}. Return ONLY the <svg> code.`;
    const response = await this.generateText(prompt, { maxTokens: 1000 });
    return response;
  }

  static async generateCustomIcon(prompt: string): Promise<string> {
    if (AI_CONFIG.useMock) {
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>`;
    }
    
    const iconPrompt = `Synthesize a high-quality SVG icon for: ${prompt}. Return ONLY the <svg> code. Ensure it is monochrome and uses stroke-width 2.`;
    const response = await this.generateText(iconPrompt, { maxTokens: 800 });
    return response;
  }

  static async generateAudio(text: string): Promise<string> {
    if (AI_CONFIG.useMock) {
      // Mock audio URL (using a sample audio file)
      return 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
    }
    // Real Text-to-Speech logic
    return '';
  }

  // ========== VISION & COGNITIVE AUDIT ==========

  static async analyzeLayout(imageData: string): Promise<any> {
    if (AI_CONFIG.useMock) {
      return {
        score: 85,
        issues: [
          { type: 'contrast', severity: 'medium', message: 'Low contrast on Hero subtitle text.', elementId: 'hero-1' },
          { type: 'accessibility', severity: 'high', message: 'Missing alt text on 3 gallery images.', elementId: 'gallery-1' },
          { type: 'ux', severity: 'low', message: 'Primary CTA button could be 20% larger for mobile.', elementId: 'hero-cta' }
        ],
        heatmap: 'https://via.placeholder.com/800x600/ff0000/ffffff?text=Predicted+Heatmap'
      };
    }
    // Real GPT-4o Vision logic would go here
    return null;
  }

  // ========== MOTION & VIDEO SYNTHESIS ==========

  static async generateMotionSequence(description: string): Promise<any> {
    if (AI_CONFIG.useMock) {
      return {
        initial: { opacity: 0, y: 20, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { type: 'spring', stiffness: 100, damping: 10, delay: 0.2 }
      };
    }
    
    const prompt = `Generate a Framer Motion configuration object for a React component based on this description: ${description}. Return ONLY the JSON object.`;
    const response = await this.generateText(prompt, { maxTokens: 500 });
    try {
      return JSON.parse(response);
    } catch (e) {
      return { opacity: 1 };
    }
  }

  static async generateVideoBackground(prompt: string): Promise<string> {
    if (AI_CONFIG.useMock) {
      return 'https://assets.mixkit.co/videos/preview/mixkit-abstract-flowing-blue-and-purple-gradient-background-27450-large.mp4';
    }
    // Real Sora/Runway logic
    return '';
  }
}
