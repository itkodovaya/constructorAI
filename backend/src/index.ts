import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { ProjectsService } from './services/projects.service';
import { ExportService } from './services/export.service';
import { PresentationExportService } from './services/presentation-export.service';
import { BrandKitExportService } from './services/brandkit-export.service';
import { BatchPostService } from './services/batch-post.service';
import { TranslateService } from './services/translate.service';
import { AIContentService } from './services/ai_content.service';
import { AdvancedAIService } from './services/advanced-ai.service';
import { AIService } from './services/ai.service';
import { AI_CONFIG } from './config/ai.config';
import { CreateProjectSchema, UpdateProjectSchema, validateProject } from './validation/project.validation';
import { ErrorHandler } from './middleware/errorHandler';
import { authenticate, AuthenticatedRequest, requirePlan, checkLimit } from './middleware/auth.middleware';
import { UserService } from './services/user.service';
import { CollaborationService } from './services/collaboration.service';
import { TemplateMarketplaceService } from './services/template-marketplace.service';
import { FineTuningService } from './services/fine-tuning.service';
import { RolePermissionsService } from './services/role-permissions.service';
import { ThemeService } from './services/theme.service';
import { DAMService, Asset } from './services/dam.service';
import { PushNotificationsService } from './services/push-notifications.service';
import { ReferralService } from './services/referral.service';
import { ProductAnalyticsService } from './services/product-analytics.service';
import { ContentLocalizationService } from './services/content-localization.service';
import { RagService } from './services/rag.service';
import { AgentService } from './services/agent.service';
import { DataTableService } from './services/data-table.service';
import { VersioningService } from './services/versioning.service';
import { AuditLogService } from './services/audit-log.service';
import { LeadsService } from './services/leads.service';
import { ProductsService } from './services/products.service';
import { BlogService } from './services/blog.service';
import { SeoPerformanceService } from './services/seo-performance.service';
import { TemplateService } from './services/template.service';
import { IntegrationService } from './services/integration.service';
import { OrganizationService } from './services/organization.service';
import { KnowledgeService } from './services/knowledge.service';
import { AgentService } from './services/agent.service';
import { VoiceService } from './services/voice.service';
import { EvolutionService } from './services/evolution.service';
import { SemanticSearchService } from './services/semantic-search.service';
import { EmotionalAIService } from './services/emotional-ai.service';
import { SimulationService } from './services/simulation.service';
import { MarketingAutomationService } from './services/marketing-automation.service';
import { ComplianceService } from './services/compliance.service';
import { PredictiveService } from './services/predictive.service';
import { AIGovernanceService } from './services/ai-governance.service';
import { ComplianceAuditorService } from './services/compliance-auditor.service';
import { MemoryService } from './services/memory.service';
import { AISiteGeneratorService } from './services/ai-site-generator.service';
import multer from 'multer';
import { swaggerDocument } from './docs/swagger';
import { HealthService } from './services/health.service';
import { logger } from './utils/logger';
import { metricsMiddleware } from './utils/metrics';
import { ErrorHandler as EnhancedErrorHandler } from './utils/enhanced-error-handler';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Логирование и метрики
app.use(metricsMiddleware);
logger.setContext('Express');

// Swagger документация
app.get('/api-docs/swagger.json', (req, res) => {
  res.json(swaggerDocument);
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbCheck = await HealthService.checkDatabase();
    const diskCheck = await HealthService.checkDiskSpace();
    const systemInfo = await HealthService.getSystemInfo();
    
    const healthy = dbCheck.healthy && diskCheck.healthy;
    
    res.status(healthy ? 200 : 503).json({
      status: healthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      version: '1.0.1',
      aiMode: AI_CONFIG.useMock ? 'MOCK' : 'REAL',
      checks: {
        database: dbCheck,
        disk: diskCheck,
      },
      system: systemInfo,
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'Health check failed',
    });
  }
});

// Конфигурация AI
AIService.configure(AI_CONFIG);

// Инициализация демо-шаблонов маркетплейса
TemplateMarketplaceService.initializeDemoTemplates();

// ========== АУТЕНТИФИКАЦИЯ ==========

// Регистрация
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password and name are required' });
    }

    const user = await UserService.createUser(email, password, name);
    res.status(201).json({ 
      user: { ...user, passwordHash: '' },
      message: 'User created successfully'
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Вход
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await UserService.authenticate(email, password);
    
    if (!result) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получение текущего пользователя
app.get('/api/auth/me', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const user = UserService.getUserById(req.user!.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получение информации о планах
app.get('/api/plans', (req, res) => {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      limits: UserService.getPlanLimits('free')
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29,
      limits: UserService.getPlanLimits('pro')
    },
    {
      id: 'brandkit',
      name: 'BrandKit',
      price: 99,
      limits: UserService.getPlanLimits('brandkit')
    }
  ];
  res.json({ plans });
});

// Обновление плана пользователя
app.post('/api/auth/upgrade-plan', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { plan } = req.body;
    
    if (!['pro', 'brandkit'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    // В реальности здесь была бы интеграция с платежной системой (Stripe и т.д.)
    const user = await UserService.updatePlan(req.user!.id, plan);
    res.json({ user, message: 'Plan upgraded successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== ПРОЕКТЫ ==========

// Получение всех проектов (теперь с фильтрацией по пользователю)
// GET /api/projects - публичный для демо-режима
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await ProjectsService.getAll();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Получение одного проекта
app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await ProjectsService.getById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Создание проекта (Onboarding) - требует аутентификации и проверки лимитов
app.post('/api/projects', authenticate, checkLimit('project'), async (req: AuthenticatedRequest, res) => {
  console.log('[POST /api/projects] Request body:', JSON.stringify(req.body, null, 2));
  try {
    // Валидация входных данных
    const validation = validateProject(req.body, CreateProjectSchema);
    if (!validation.success) {
      console.log('[POST /api/projects] Validation failed:', validation.errors);
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validation.errors 
      });
    }

    // Добавляем userId к проекту
    const projectData = {
      ...validation.data,
      userId: req.user!.id
    };

    console.log('[POST /api/projects] Calling ProjectsService.create...');
    const project = await ProjectsService.create(projectData, req.user!.id);
    
    // Увеличиваем счетчик проектов пользователя
    console.log('[POST /api/projects] Incrementing usage...');
    await UserService.incrementUsage(req.user!.id, 'project');
    
    console.log('[POST /api/projects] Success! Returning project:', project.id);
    res.status(201).json(project);
  } catch (error: any) {
    console.error('[POST /api/projects] Error:', error);
    res.status(500).json({ error: 'Failed to create project', details: error.message });
  }
});

// Обновление проекта
app.put('/api/projects/:id', async (req, res) => {
  try {
    // Валидация входных данных
    const validation = validateProject(req.body, UpdateProjectSchema);
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validation.errors 
      });
    }

    const project = await ProjectsService.update(req.params.id, validation.data);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Удаление проекта
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const success = await ProjectsService.delete(req.params.id);
    if (!success) return res.status(404).json({ error: 'Project not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// AI Перевод проекта (с использованием реального AI или заглушек)
app.post('/api/projects/:id/translate', async (req, res) => {
  try {
    const project = await ProjectsService.getById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    const targetLang = req.body.lang || 'en';
    
    // Используем реальный AI для перевода текста в блоках
    const translatedPages = await Promise.all(
      project.pages.map(async (page) => ({
        ...page,
        blocks: await Promise.all(
          page.blocks.map(async (block) => {
            const translatedContent = await translateBlockContent(block.content, targetLang);
            return { ...block, content: translatedContent };
          })
        )
      }))
    );

    const updatedProject = await ProjectsService.update(project.id, {
      pages: translatedPages
    });
    
    res.json(updatedProject);
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

// Вспомогательная функция для перевода контента блока
async function translateBlockContent(content: any, targetLang: 'ru' | 'en'): Promise<any> {
  if (typeof content === 'string') {
    return await AIService.translateText(content, targetLang);
  }
  
  if (Array.isArray(content)) {
    return await Promise.all(content.map(item => translateBlockContent(item, targetLang)));
  }
  
  if (typeof content === 'object' && content !== null) {
    const translated: any = {};
    for (const key in content) {
      translated[key] = await translateBlockContent(content[key], targetLang);
    }
    return translated;
  }
  
  return content;
}

// AI Генерация полного контента страницы (с использованием реального AI) - требует проверки лимитов
app.post('/api/projects/:id/generate-content', authenticate, checkLimit('ai_generation'), async (req: AuthenticatedRequest, res) => {
  try {
    const project = await ProjectsService.getById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    // Используем реальный AI для генерации контента
    const prompt = `Создай контент для сайта бренда "${project.brandName}" в нише "${project.niche}". Нужны блоки: Hero (заголовок и подзаголовок), Features (3-4 особенности), Text (описание), Footer.`;
    
    const aiContent = await AIService.generateText(prompt, 800);
    
    // Парсим ответ AI и создаем блоки (упрощенная версия)
    const newBlocks = AIContentService.generatePageContent(project.niche, project.brandName);
    
    // Если AI вернул контент, обновляем блоки
    if (aiContent && !AI_CONFIG.useMock) {
      // В реальности здесь будет более сложный парсинг ответа AI
      newBlocks[0].content.title = project.brandName;
      newBlocks[0].content.subtitle = aiContent.substring(0, 100);
    }
    
    const updatedProject = await ProjectsService.update(project.id, {
      pages: [{ ...project.pages[0], blocks: newBlocks }]
    });
    
    // Увеличиваем счетчик AI генераций
    if (req.user) {
      await UserService.incrementUsage(req.user.id, 'ai_generation');
    }
    
    res.json(updatedProject);
  } catch (error) {
    console.error('Content generation error:', error);
    // Fallback на старый метод
    try {
      const project = await ProjectsService.getById(req.params.id);
      const newBlocks = AIContentService.generatePageContent(project!.niche, project!.brandName);
      const updatedProject = await ProjectsService.update(project!.id, {
        pages: [{ ...project!.pages[0], blocks: newBlocks }]
      });
      res.json(updatedProject);
    } catch (fallbackError) {
      res.status(500).json({ error: 'Failed to generate content' });
    }
  }
});

// Предпросмотр HTML (возвращает HTML для отображения в iframe)
app.get('/api/projects/:id/preview', async (req, res) => {
  try {
    const project = await ProjectsService.getById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    const activePageId = (req.query.page as string) || (project.pages[0]?.id) || '1';
    
    const html = ExportService.generateFullHTML(
      project.id,
      project.brandName,
      project.brandAssets,
      project.pages || [],
      activePageId,
      project.seo,
      project.seo?.lang || 'ru',
      project.products || []
    );
    
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('Preview error:', error);
    res.status(500).json({ error: 'Failed to generate preview' });
  }
});

// Экспорт сайта в HTML
app.post('/api/projects/:id/export', async (req, res) => {
  try {
    const project = await ProjectsService.getById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    const products = await ProductsService.getProjectProducts(req.params.id);
    const posts = await BlogService.getProjectPosts(req.params.id);
    
    const activePageId = (req.query.page as string) || (project.pages[0]?.id) || '1';

    const html = ExportService.generateFullHTML(
      project.id,
      project.brandName,
      project.brandAssets,
      project.pages || [],
      activePageId,
      project.seo,
      project.seo?.lang || 'ru',
      products,
      posts
    );
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="${project.brandName}_website.html"`);
    res.send(html);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export site' });
  }
});

// Экспорт презентации в PDF
app.post('/api/projects/:id/export-presentation', async (req, res) => {
  try {
    const project = await ProjectsService.getById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    const format = req.body.format || '16:9'; // '16:9' или '4:3'
    const slides = project.presentation || [];
    
    const pdfBuffer = await PresentationExportService.exportToPDF({
      format: format as '16:9' | '4:3',
      slides,
      brandName: project.brandName,
      brandAssets: project.brandAssets
    });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${project.brandName}_presentation.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Export presentation error:', error);
    res.status(500).json({ error: 'Failed to export presentation' });
  }
});

// Экспорт бренд-кита в ZIP
app.post('/api/projects/:id/export-brandkit', async (req, res) => {
  try {
    const project = await ProjectsService.getById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    // TODO: Реализовать генерацию PDF через библиотеку (например, pdfkit или puppeteer)
    res.json({ message: 'PDF export будет реализован в следующей версии', slides: project.presentation || [] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to export presentation' });
  }
});

// Экспорт бренд-кита в ZIP
app.post('/api/projects/:id/export-brandkit', async (req, res) => {
  try {
    const project = await ProjectsService.getById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    const zipBuffer = await BrandKitExportService.exportToZIPBuffer({
      brandName: project.brandName,
      logoUrl: project.brandAssets?.logoUrl,
      logoSvg: project.brandAssets?.logoSvg,
      palette: project.brandAssets?.palette || [],
      fonts: project.brandAssets?.fonts || [],
      socialTemplates: project.brandAssets?.socialTemplates || []
    });
    
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${project.brandName}_brandkit.zip"`);
    res.send(zipBuffer);
  } catch (error) {
    console.error('Export brandkit error:', error);
    res.status(500).json({ error: 'Failed to export brand kit' });
  }
});

// Расширенная AI генерация контента для блока
app.post('/api/projects/:id/generate-block-content', async (req, res) => {
  try {
    const project = await ProjectsService.getById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    const { blockType } = req.body;
    
    const content = await AdvancedAIService.generateBlockContent(blockType, {
      brandName: project.brandName,
      niche: project.niche || 'general',
      style: project.style || 'modern'
    });
    
    res.json({ content });
  } catch (error) {
    console.error('Generate block content error:', error);
    res.status(500).json({ error: 'Failed to generate block content' });
  }
});

// Предложения по улучшению сайта
app.get('/api/projects/:id/ai-suggestions', async (req, res) => {
  try {
    const project = await ProjectsService.getById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const existingBlocks = project.pages?.flatMap((p: any) => p.blocks?.map((b: any) => b.type) || []) || [];

    const suggestions = await AdvancedAIService.generateSuggestions({
      brandName: project.brandName,
      niche: project.niche || 'general',
      existingBlocks
    });

    res.json({ suggestions });
  } catch (error: any) {
    console.error('Generate suggestions error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Генерация серии постов для соцсетей через AI
app.post('/api/projects/:id/generate-social-posts-ai', async (req, res) => {
  try {
    const project = await ProjectsService.getById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    const { count = 5, platforms = ['Instagram', 'VK'] } = req.body;
    
    const posts = await AdvancedAIService.generateSocialPosts(count, {
      brandName: project.brandName,
      niche: project.niche || 'general',
      platforms
    });
    
    res.json({ posts });
  } catch (error) {
    console.error('Generate social posts AI error:', error);
    res.status(500).json({ error: 'Failed to generate social posts' });
  }
});

// Добавление задачи в очередь AI
app.post('/api/ai/queue-task', async (req, res) => {
  try {
    const { type, prompt, options } = req.body;
    
    const taskId = await AdvancedAIService.queueTask({
      type,
      prompt,
      options
    });
    
    res.json({ taskId });
  } catch (error) {
    console.error('Queue task error:', error);
    res.status(500).json({ error: 'Failed to queue task' });
  }
});

// Получение статуса задачи
app.get('/api/ai/task/:taskId', async (req, res) => {
  try {
    const task = AdvancedAIService.getTaskStatus(req.params.taskId);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Get task status error:', error);
    res.status(500).json({ error: 'Failed to get task status' });
  }
});

// Enhanced AI Features
app.post('/api/ai/generate-with-context', async (req, res) => {
  try {
    const result = await AISiteGeneratorService.generateWithContext(req.body);
    res.json(result);
  } catch (error: any) {
    console.error('Context-aware generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate with context' });
  }
});

app.post('/api/ai/multi-language', async (req, res) => {
  try {
    const result = await AISiteGeneratorService.generateMultiLanguageContent(req.body);
    res.json(result);
  } catch (error: any) {
    console.error('Multi-language generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate multi-language content' });
  }
});

app.post('/api/ai/design-suggestions', async (req, res) => {
  try {
    const result = await AISiteGeneratorService.getDesignSuggestions(req.body);
    res.json(result);
  } catch (error: any) {
    console.error('Design suggestions error:', error);
    res.status(500).json({ error: error.message || 'Failed to get design suggestions' });
  }
});

app.post('/api/ai/seo-content', async (req, res) => {
  try {
    const result = await AISiteGeneratorService.generateSEOContent(
      req.body.topic,
      req.body.keywords,
      req.body.targetLength || 500,
      req.body.projectId
    );
    res.json(result);
  } catch (error: any) {
    console.error('SEO content generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate SEO content' });
  }
});

app.post('/api/ai/content-variations', async (req, res) => {
  try {
    const result = await AISiteGeneratorService.generateContentVariations(
      req.body.originalContent,
      req.body.count || 3,
      req.body.projectId
    );
    res.json(result);
  } catch (error: any) {
    console.error('Content variations error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate content variations' });
  }
});

// ========== КОЛЛАБОРАЦИЯ ==========

// Создание приглашения в проект
app.post('/api/projects/:id/invite', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const project = await ProjectsService.getById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const { email, role } = req.body;
    if (!email || !role) {
      return res.status(400).json({ error: 'Email and role are required' });
    }

    const invitation = await CollaborationService.createInvitation(
      req.params.id,
      email,
      role,
      req.user!.id
    );

    res.status(201).json({ invitation });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Принятие приглашения
app.post('/api/invitations/:id/accept', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const user = UserService.getUserById(req.user!.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const collaborator = await CollaborationService.acceptInvitation(
      req.params.id,
      req.user!.id,
      user.email,
      user.name
    );

    res.json({ collaborator });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Получение коллабораторов проекта
app.get('/api/projects/:id/collaborators', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const collaborators = CollaborationService.getProjectCollaborators(req.params.id);
    res.json({ collaborators });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Удаление коллаборатора
app.delete('/api/projects/:id/collaborators/:userId', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const success = await CollaborationService.removeCollaborator(
      req.params.id,
      req.params.userId,
      req.user!.id
    );

    if (!success) {
      return res.status(404).json({ error: 'Collaborator not found' });
    }

    res.json({ message: 'Collaborator removed' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== МАРКЕТПЛЕЙС ШАБЛОНОВ ==========

// Получение всех шаблонов
app.get('/api/templates', (req, res) => {
  try {
    const filters = {
      category: req.query.category as string,
      search: req.query.search as string,
      minRating: req.query.minRating ? parseFloat(req.query.minRating as string) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      featured: req.query.featured === 'true',
      tags: req.query.tags ? (req.query.tags as string).split(',') : undefined
    };

    const templates = TemplateMarketplaceService.getTemplates(filters);
    res.json({ templates });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получение шаблона по ID
app.get('/api/templates/:id', (req, res) => {
  try {
    const template = TemplateMarketplaceService.getTemplateById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json({ template });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Скачивание шаблона
app.post('/api/templates/:id/download', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const template = await TemplateMarketplaceService.downloadTemplate(
      req.params.id,
      req.user!.id
    );

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json({ template });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Добавление отзыва к шаблону
app.post('/api/templates/:id/reviews', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { rating, comment } = req.body;
    const user = UserService.getUserById(req.user!.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const review = await TemplateMarketplaceService.addReview(
      req.params.id,
      req.user!.id,
      user.name,
      rating,
      comment
    );

    res.status(201).json({ review });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Получение отзывов шаблона
app.get('/api/templates/:id/reviews', (req, res) => {
  try {
    const reviews = TemplateMarketplaceService.getTemplateReviews(req.params.id);
    res.json({ reviews });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получение категорий шаблонов
app.get('/api/templates/categories', (req, res) => {
  try {
    const categories = TemplateMarketplaceService.getCategories();
    res.json({ categories });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== AI CHAT ASSISTANT ==========

// Чат с AI-ассистентом
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { projectId, message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const { AIChatService } = require('./services/ai-chat.service');
    const response = await AIChatService.chat(projectId || null, message);
    
    res.json(response);
  } catch (error: any) {
    console.error('AI Chat error:', error);
    res.status(500).json({ error: error.message || 'Failed to process chat message' });
  }
});

// Получение предложений от AI
// ========== AI & AUTOPILOT ==========

app.post('/api/ai/autopilot/bulk-posts/:projectId', async (req, res) => {
  try {
    const { niche, count } = req.body;
    const posts = await AdvancedAIService.bulkGenerateBlogPosts(req.params.projectId, niche, count);
    
    // Save generated posts to DB
    const createdPosts = [];
    for (const postData of posts) {
      const post = await BlogService.createPost({
        projectId: req.params.projectId,
        ...postData
      });
      createdPosts.push(post);
    }
    
    res.json({ posts: createdPosts });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/autopilot/product-copy', async (req, res) => {
  try {
    const { productName, features } = req.body;
    const copy = await AdvancedAIService.generateProductCopy(productName, features);
    res.json({ copy });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/synthesize', async (req, res) => {
  try {
    const { description, brandContext } = req.body;
    const html = await AdvancedAIService.synthesizeComponent(description, brandContext);
    res.json({ html });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/audit-compliance', async (req, res) => {
  try {
    const { content } = req.body;
    const audit = await ComplianceService.auditContent(content);
    res.json(audit);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== AI GOVERNANCE ==========

// Log AI decision
app.post('/api/governance/decisions', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { action, projectId, model, prompt, response, reasoning, confidence, metadata } = req.body;
    const decision = await AIGovernanceService.logDecision(req.user!.id, action, {
      projectId,
      model,
      prompt,
      response,
      reasoning,
      confidence,
      metadata,
    });
    res.status(201).json({ decision });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get governance dashboard data
app.get('/api/governance/dashboard', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { organizationId, startDate, endDate } = req.query;
    const period = startDate && endDate
      ? { start: new Date(startDate as string), end: new Date(endDate as string) }
      : undefined;
    
    const dashboard = await AIGovernanceService.getDashboardData(
      req.user!.id,
      organizationId as string,
      period
    );
    res.json(dashboard);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get AI usage statistics
app.get('/api/governance/usage', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { projectId, startDate, endDate } = req.query;
    const stats = AIGovernanceService.getUsageStats(
      req.user!.id,
      projectId as string,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get project AI decisions
app.get('/api/projects/:id/governance/decisions', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { limit } = req.query;
    const decisions = AIGovernanceService.getProjectDecisions(
      req.params.id,
      limit ? parseInt(limit as string) : 50
    );
    res.json({ decisions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Export governance data
app.get('/api/governance/export', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { organizationId, startDate, endDate } = req.query;
    const period = startDate && endDate
      ? { start: new Date(startDate as string), end: new Date(endDate as string) }
      : undefined;
    
    const data = await AIGovernanceService.exportGovernanceData(
      req.user!.id,
      organizationId as string,
      period
    );
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== COMPLIANCE AUDITOR ==========

// Run compliance audit
app.post('/api/compliance/audit', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { auditType, projectId, content, data } = req.body;
    const audit = await ComplianceAuditorService.runAudit(auditType, {
      projectId,
      userId: req.user!.id,
      content,
      data,
    });
    res.status(201).json({ audit });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get compliance report
app.get('/api/compliance/report', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { projectId, startDate, endDate } = req.query;
    const period = startDate && endDate
      ? { start: new Date(startDate as string), end: new Date(endDate as string) }
      : undefined;
    
    const report = await ComplianceAuditorService.getComplianceReport(
      projectId as string,
      req.user!.id,
      period
    );
    res.json(report);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get audit history
app.get('/api/compliance/audits', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { projectId, limit } = req.query;
    const audits = ComplianceAuditorService.getAuditHistory(
      projectId as string,
      req.user!.id,
      limit ? parseInt(limit as string) : 50
    );
    res.json({ audits });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Export compliance data
app.get('/api/compliance/export', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { projectId } = req.query;
    const data = await ComplianceAuditorService.exportComplianceData(
      projectId as string,
      req.user!.id
    );
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/projects/:id/personalization', async (req, res) => {
  try {
    const { rules } = req.body;
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: { personalizationRules: JSON.stringify(rules) }
    });
    res.json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/marketing-campaign/:projectId', async (req, res) => {
  try {
    const { goal, channels } = req.body;
    const campaign = await MarketingAutomationService.createCampaign(req.params.projectId, goal, channels);
    res.json(campaign);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/simulate-growth', async (req, res) => {
  try {
    const { currentLeads, conversionRate, marketingSpend, increase } = req.body;
    const result = await SimulationService.runGrowthSimulation(currentLeads, conversionRate, marketingSpend, increase);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/analyze-vibe', async (req, res) => {
  try {
    const { events } = req.body;
    const vibe = await EmotionalAIService.analyzeInteraction(events);
    res.json(vibe);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/omni-command/:projectId', async (req, res) => {
  try {
    const { prompt } = req.body;
    const result = await SemanticSearchService.parseOmniCommand(req.params.projectId, prompt);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/projects/:id/semantic-search', async (req, res) => {
  try {
    const { query } = req.query;
    const results = await SemanticSearchService.globalSearch(req.params.id, query as string);
    res.json({ results });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/auto-evolve/:projectId', async (req, res) => {
  try {
    const { blockId, blockType } = req.body;
    const test = await EvolutionService.autoCreateExperiment(req.params.projectId, blockId, blockType);
    res.json(test);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/motion-sequence', async (req, res) => {
  try {
    const { description } = req.body;
    const motion = await AdvancedAIService.generateMotionSequence(description);
    res.json(motion);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/video-background', async (req, res) => {
  try {
    const { prompt } = req.body;
    const videoUrl = await AdvancedAIService.generateVideoBackground(prompt);
    res.json({ videoUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/vision-audit', async (req, res) => {
  try {
    const { imageData } = req.body;
    const audit = await AdvancedAIService.analyzeLayout(imageData);
    res.json(audit);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/text-to-speech', async (req, res) => {
  try {
    const { text } = req.body;
    const audioUrl = await AdvancedAIService.generateAudio(text);
    res.json({ audioUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/svg-pattern', async (req, res) => {
  try {
    const { vibe } = req.body;
    const svg = await AdvancedAIService.generateSVGPattern(vibe);
    res.json({ svg });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/icon', async (req, res) => {
  try {
    const { prompt } = req.body;
    const svg = await AdvancedAIService.generateCustomIcon(prompt);
    res.json({ svg });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/image-variants', async (req, res) => {
  try {
    const { prompt, count } = req.body;
    const variants = await AdvancedAIService.generateImageVariants(prompt, count);
    res.json({ variants });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/logo', async (req, res) => {
  try {
    const { brandName, personality } = req.body;
    const logoUrl = await AdvancedAIService.generateLogo(brandName, personality);
    res.json({ logoUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/ai/suggestions/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { type } = req.query;
    
    if (!type || !['layout', 'text', 'image', 'color'].includes(type as string)) {
      return res.status(400).json({ error: 'Invalid type. Must be: layout, text, image, or color' });
    }

    const { AIChatService } = require('./services/ai-chat.service');
    const suggestions = await AIChatService.getSuggestions(
      projectId === 'null' ? null : projectId,
      type as 'layout' | 'text' | 'image' | 'color'
    );
    
    res.json(suggestions);
  } catch (error: any) {
    console.error('AI Suggestions error:', error);
    res.status(500).json({ error: error.message || 'Failed to get suggestions' });
  }
});

// Получение популярных шаблонов
app.get('/api/templates/popular', (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const templates = TemplateMarketplaceService.getPopularTemplates(limit);
    res.json({ templates });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== COMMENTS SYSTEM ==========

// Получение комментариев проекта
app.get('/api/projects/:id/comments', async (req, res) => {
  try {
    const { CommentsService } = require('./services/comments.service');
    const comments = CommentsService.getComments(req.params.id);
    res.json({ comments });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получение комментариев элемента
app.get('/api/projects/:id/comments/element/:elementId', async (req, res) => {
  try {
    const { CommentsService } = require('./services/comments.service');
    const comments = CommentsService.getElementComments(req.params.id, req.params.elementId);
    res.json({ comments });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получение тредов комментариев
app.get('/api/projects/:id/comments/threads', async (req, res) => {
  try {
    const { CommentsService } = require('./services/comments.service');
    const threads = CommentsService.getCommentThreads(req.params.id);
    res.json({ threads });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Добавление комментария
app.post('/api/projects/:id/comments', async (req, res) => {
  try {
    const { CommentsService } = require('./services/comments.service');
    const { elementId, elementType, userId, userName, content, position, parentId } = req.body;
    
    if (!elementId || !elementType || !userId || !userName || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const comment = CommentsService.addComment(
      req.params.id,
      elementId,
      elementType,
      userId,
      userName,
      content,
      position,
      parentId
    );

    res.status(201).json({ comment });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Обновление комментария
app.put('/api/projects/:id/comments/:commentId', async (req, res) => {
  try {
    const { CommentsService } = require('./services/comments.service');
    const comment = CommentsService.updateComment(req.params.id, req.params.commentId, req.body);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json({ comment });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Удаление комментария
app.delete('/api/projects/:id/comments/:commentId', async (req, res) => {
  try {
    const { CommentsService } = require('./services/comments.service');
    const success = CommentsService.deleteComment(req.params.id, req.params.commentId);
    
    if (!success) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Отметка комментария как решенного
app.post('/api/projects/:id/comments/:commentId/resolve', async (req, res) => {
  try {
    const { CommentsService } = require('./services/comments.service');
    const comment = CommentsService.resolveComment(req.params.id, req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json({ comment });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Статистика комментариев
app.get('/api/projects/:id/comments/stats', async (req, res) => {
  try {
    const { CommentsService } = require('./services/comments.service');
    const stats = CommentsService.getCommentStats(req.params.id);
    res.json({ stats });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== SEMANTIC SEARCH ==========

// Семантический поиск
app.post('/api/search/semantic', async (req, res) => {
  try {
    const { semanticSearchService } = require('./services/semantic-search.service');
    const { query, type, limit } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const results = await semanticSearchService.search(query, type, limit || 10);
    res.json({ results });
  } catch (error: any) {
    console.error('Semantic search error:', error);
    res.status(500).json({ error: error.message || 'Failed to perform semantic search' });
  }
});

// Поиск похожих элементов
app.get('/api/search/similar/:itemId', async (req, res) => {
  try {
    const { semanticSearchService } = require('./services/semantic-search.service');
    const { limit } = req.query;
    
    const results = await semanticSearchService.findSimilar(
      req.params.itemId,
      limit ? parseInt(limit as string) : 5
    );
    
    res.json({ results });
  } catch (error: any) {
    console.error('Similar search error:', error);
    res.status(500).json({ error: error.message || 'Failed to find similar items' });
  }
});

// Индексация элемента
app.post('/api/search/index', async (req, res) => {
  try {
    const { semanticSearchService } = require('./services/semantic-search.service');
    const { id, type, text, metadata } = req.body;
    
    if (!id || !type || !text) {
      return res.status(400).json({ error: 'Missing required fields: id, type, text' });
    }

    await semanticSearchService.indexItem(id, type, text, metadata);
    res.json({ success: true });
  } catch (error: any) {
    console.error('Indexing error:', error);
    res.status(500).json({ error: error.message || 'Failed to index item' });
  }
});

// Удаление из индекса
app.delete('/api/search/index/:id', async (req, res) => {
  try {
    const { semanticSearchService } = require('./services/semantic-search.service');
    semanticSearchService.removeFromIndex(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Статистика индекса
app.get('/api/search/stats', async (req, res) => {
  try {
    const { semanticSearchService } = require('./services/semantic-search.service');
    const stats = semanticSearchService.getIndexStats();
    res.json({ stats });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== CUSTOM COMPONENTS ==========

// Получение компонентов пользователя
app.get('/api/components/my', async (req, res) => {
  try {
    const { CustomComponentsService } = require('./services/custom-components.service');
    const userId = req.query.userId as string || 'user-1'; // В реальности из токена
    const components = CustomComponentsService.getUserComponents(userId);
    res.json({ components });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получение публичных компонентов
app.get('/api/components/public', async (req, res) => {
  try {
    const { CustomComponentsService } = require('./services/custom-components.service');
    const components = CustomComponentsService.getPublicComponents({
      category: req.query.category as string,
      search: req.query.search as string,
      tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined
    });
    res.json({ components });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Создание компонента
app.post('/api/components', async (req, res) => {
  try {
    const { CustomComponentsService } = require('./services/custom-components.service');
    const userId = req.body.userId || 'user-1';
    const { name, description, category, code, props, preview, tags, isPublic } = req.body;

    // Валидация кода
    const validation = CustomComponentsService.validateComponentCode(code);
    if (!validation.valid) {
      return res.status(400).json({ error: 'Invalid component code', details: validation.errors });
    }

    const component = CustomComponentsService.createComponent(userId, {
      name,
      description,
      category,
      version: '1.0.0',
      code,
      props: props || [],
      preview,
      tags: tags || [],
      isPublic: isPublic || false
    });

    res.status(201).json({ component });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Установка компонента
app.post('/api/components/:id/install', async (req, res) => {
  try {
    const { CustomComponentsService } = require('./services/custom-components.service');
    const userId = req.body.userId || 'user-1';
    const success = CustomComponentsService.installComponent(req.params.id, userId);
    
    if (!success) {
      return res.status(404).json({ error: 'Component not found' });
    }

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== LEADS & CRM ==========

// Получение всех лидов проекта
app.get('/api/projects/:id/leads', async (req, res) => {
  try {
    const leads = await LeadsService.getProjectLeads(req.params.id);
    res.json({ leads });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Создание лида (публичный эндпоинт для форм)
app.post('/api/projects/:id/leads', async (req, res) => {
  try {
    const lead = await LeadsService.createLead({
      projectId: req.params.id,
      ...req.body
    });
    res.status(201).json({ lead });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Обновление статуса лида
app.put('/api/leads/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const lead = await LeadsService.updateLeadStatus(req.params.id, status);
    res.json({ lead });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Обновление лида (теги, заметки)
app.patch('/api/leads/:id', async (req, res) => {
  try {
    const lead = await LeadsService.updateLead(req.params.id, req.body);
    res.json({ lead });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Удаление лида
app.delete('/api/leads/:id', async (req, res) => {
  try {
    await LeadsService.deleteLead(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== PRODUCTS & E-COMMERCE ==========

// Получение продуктов проекта
app.get('/api/projects/:id/products', async (req, res) => {
  try {
    const products = await ProductsService.getProjectProducts(req.params.id);
    res.json({ products });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Создание продукта
app.post('/api/projects/:id/products', async (req, res) => {
  try {
    const product = await ProductsService.createProduct({
      projectId: req.params.id,
      ...req.body
    });
    res.status(201).json({ product });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Обновление продукта
app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await ProductsService.updateProduct(req.params.id, req.body);
    res.json({ product });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Удаление продукта
app.delete('/api/products/:id', async (req, res) => {
  try {
    await ProductsService.deleteProduct(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Категории
app.get('/api/projects/:id/categories', async (req, res) => {
  try {
    const categories = await ProductsService.getProjectCategories(req.params.id);
    res.json({ categories });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects/:id/categories', async (req, res) => {
  try {
    const { name } = req.body;
    const category = await ProductsService.createCategory(req.params.id, name);
    res.status(201).json({ category });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects/:id/track-correction', async (req, res) => {
  try {
    const { blockType, originalContent, newContent } = req.body;
    await MemoryService.trackCorrection(req.params.id, blockType, originalContent, newContent);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ai/voice-command/:projectId', async (req, res) => {
  try {
    const { transcript } = req.body;
    const result = await VoiceService.parseCommand(req.params.projectId, transcript);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/projects/:id/forecast', async (req, res) => {
  try {
    const forecast = await PredictiveService.getForecast(req.params.id);
    res.json(forecast);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== AGENTIC AI & TASKS ==========

app.patch('/api/agents/:id', async (req, res) => {
  try {
    const agent = await AgentService.updateAgent(req.params.id, req.body);
    res.json(agent);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/agents', async (req, res) => {
  try {
    const agents = await AgentService.getAvailableAgents();
    res.json({ agents });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/projects/:id/tasks', async (req, res) => {
  try {
    const tasks = await AgentService.getProjectTasks(req.params.id);
    res.json({ tasks });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects/:id/tasks', async (req, res) => {
  try {
    const task = await AgentService.createTask({
      projectId: req.params.id,
      ...req.body
    });
    res.status(201).json({ task });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tasks/:id/swarm', async (req, res) => {
  try {
    await AgentService.initiateSwarm(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tasks/:id/messages', async (req, res) => {
  try {
    const { senderId, content, type } = req.body;
    const message = await AgentService.addTaskMessage(req.params.id, senderId, content, type);
    res.status(201).json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== KNOWLEDGE BASE (RAG) ==========

app.get('/api/organizations/:orgId/knowledge', async (req, res) => {
  try {
    const kbs = await KnowledgeService.getOrganizationKBs(req.params.orgId);
    res.json({ knowledgeBases: kbs });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/organizations/:orgId/knowledge', async (req, res) => {
  try {
    const { name, description } = req.body;
    const kb = await KnowledgeService.createKB(req.params.orgId, name, description);
    res.status(201).json({ knowledgeBase: kb });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/knowledge/:kbId/documents', async (req, res) => {
  try {
    const { name, type, content } = req.body;
    const doc = await KnowledgeService.addDocument(req.params.kbId, name, type, content);
    res.status(201).json({ document: doc });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== ORGANIZATIONS & WORKSPACES ==========

app.get('/api/workspaces', async (req, res) => {
  try {
    // In a real app, get userId from auth middleware
    const userId = req.query.userId as string;
    const workspaces = await OrganizationService.getUserOrganizations(userId);
    res.json({ workspaces });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/workspaces', async (req, res) => {
  try {
    const { name, ownerId } = req.body;
    const workspace = await OrganizationService.create(name, ownerId);
    res.status(201).json({ workspace });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== COLLABORATION & TEAMS ==========

app.post('/api/projects/:id/transfer', async (req, res) => {
  try {
    const { email } = req.body;
    await ProjectsService.transferOwnership(req.params.id, email);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/projects/:id/collaborators', async (req, res) => {
  try {
    const collaborators = await ProjectsService.getCollaborators(req.params.id);
    // Flatten the response to match frontend expectations
    const members = collaborators.map((c: any) => ({
      userId: c.userId,
      name: c.user?.name || 'Unknown',
      email: c.user?.email || '',
      role: c.role,
      invitedAt: c.createdAt
    }));
    res.json({ collaborators: members });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects/:id/invite', async (req, res) => {
  try {
    const { email, role } = req.body;
    const collaborator = await ProjectsService.inviteByEmail(req.params.id, email, role);
    res.status(201).json({ collaborator });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/projects/:id/collaborators/:userId', async (req, res) => {
  try {
    await ProjectsService.removeCollaborator(req.params.id, req.params.userId);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== INTEGRATIONS ==========

app.get('/api/projects/:id/integrations', async (req, res) => {
  try {
    const integrations = await IntegrationService.getProjectIntegrations(req.params.id);
    res.json({ integrations });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects/:id/integrations', async (req, res) => {
  try {
    const integration = await IntegrationService.createIntegration(req.params.id, req.body);
    res.status(201).json({ integration });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/integrations/:id', async (req, res) => {
  try {
    await IntegrationService.deleteIntegration(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== TEMPLATES ==========

app.get('/api/templates', async (req, res) => {
  try {
    const { projectId, type } = req.query;
    const templates = await TemplateService.getTemplates(projectId as string, type as string);
    res.json({ templates });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/templates', async (req, res) => {
  try {
    const template = await TemplateService.saveTemplate(req.body);
    res.status(201).json({ template });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/templates/:id', async (req, res) => {
  try {
    await TemplateService.deleteTemplate(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== BLOG & CMS ==========

app.get('/api/projects/:id/sitemap.xml', async (req, res) => {
  try {
    const xml = await SeoPerformanceService.generateSitemap(req.params.id, req.query.domain as string);
    res.setHeader('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получение постов проекта
app.get('/api/projects/:id/posts', async (req, res) => {
  try {
    const posts = await BlogService.getProjectPosts(req.params.id);
    res.json({ posts });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Создание поста
app.post('/api/projects/:id/posts', async (req, res) => {
  try {
    const post = await BlogService.createPost({
      projectId: req.params.id,
      ...req.body
    });
    res.status(201).json({ post });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Обновление поста
app.put('/api/posts/:id', async (req, res) => {
  try {
    const post = await BlogService.updatePost(req.params.id, req.body);
    res.json({ post });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Удаление поста
app.delete('/api/posts/:id', async (req, res) => {
  try {
    await BlogService.deletePost(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== A/B TESTS ==========

// Получение тестов проекта
app.get('/api/projects/:id/ab-tests', async (req, res) => {
  try {
    const { ABTestService } = require('./services/ab-test.service');
    const tests = ABTestService.getProjectTests(req.params.id);
    res.json({ tests });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Создание теста
app.post('/api/projects/:id/ab-tests', async (req, res) => {
  try {
    const { ABTestService } = require('./services/ab-test.service');
    const test = ABTestService.createTest(req.params.id, req.body);
    res.status(201).json({ test });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получение варианта для посетителя
app.get('/api/ab-tests/:id/variant', async (req, res) => {
  try {
    const { ABTestService } = require('./services/ab-test.service');
    const sessionId = req.query.sessionId as string || `session-${Date.now()}`;
    const variant = ABTestService.getVariantForVisitor(req.params.id, sessionId);
    
    if (!variant) {
      return res.status(404).json({ error: 'Test not found or not running' });
    }
    
    res.json({ variant, sessionId });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Регистрация конверсии
app.post('/api/ab-tests/:id/conversion', async (req, res) => {
  try {
    const { ABTestService } = require('./services/ab-test.service');
    const { sessionId, goalData } = req.body;
    const success = ABTestService.recordConversion(req.params.id, sessionId, goalData);
    
    if (!success) {
      return res.status(400).json({ error: 'Failed to record conversion' });
    }
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получение результатов теста
app.get('/api/ab-tests/:id/results', async (req, res) => {
  try {
    const { ABTestService } = require('./services/ab-test.service');
    const results = ABTestService.getTestResults(req.params.id);
    
    if (!results) {
      return res.status(404).json({ error: 'Test not found' });
    }
    
    res.json({ results });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Управление тестом
app.post('/api/ab-tests/:id/start', async (req, res) => {
  try {
    const { ABTestService } = require('./services/ab-test.service');
    const success = ABTestService.startTest(req.params.id);
    
    if (!success) {
      return res.status(404).json({ error: 'Test not found' });
    }
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ab-tests/:id/pause', async (req, res) => {
  try {
    const { ABTestService } = require('./services/ab-test.service');
    const success = ABTestService.pauseTest(req.params.id);
    
    if (!success) {
      return res.status(404).json({ error: 'Test not found' });
    }
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ab-tests/:id/complete', async (req, res) => {
  try {
    const { ABTestService } = require('./services/ab-test.service');
    const success = ABTestService.completeTest(req.params.id);
    
    if (!success) {
      return res.status(404).json({ error: 'Test not found' });
    }
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== MARKETPLACE ==========

// Получение товаров маркетплейса
app.get('/api/marketplace/items', async (req, res) => {
  try {
    const { MarketplaceService } = require('./services/marketplace.service');
    const { items, total } = MarketplaceService.getItems({
      type: req.query.type as any,
      category: req.query.category as string,
      tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
      search: req.query.search as string,
      minRating: req.query.minRating ? parseFloat(req.query.minRating as string) : undefined,
      priceRange: req.query.minPrice && req.query.maxPrice ? {
        min: parseFloat(req.query.minPrice as string),
        max: parseFloat(req.query.maxPrice as string)
      } : undefined,
      isFree: req.query.isFree === 'true' ? true : undefined,
      isFeatured: req.query.isFeatured === 'true' ? true : undefined,
      sortBy: req.query.sortBy as any,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined
    });
    res.json({ items, total });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получение товара по ID
app.get('/api/marketplace/items/:id', async (req, res) => {
  try {
    const { MarketplaceService } = require('./services/marketplace.service');
    const item = MarketplaceService.getItem(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json({ item });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Создание товара
app.post('/api/marketplace/items', async (req, res) => {
  try {
    const { MarketplaceService } = require('./services/marketplace.service');
    const item = MarketplaceService.createItem(req.body);
    res.status(201).json({ item });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получение отзывов товара
app.get('/api/marketplace/items/:id/reviews', async (req, res) => {
  try {
    const { MarketplaceService } = require('./services/marketplace.service');
    const reviews = MarketplaceService.getReviews(req.params.id, req.query.limit ? parseInt(req.query.limit as string) : undefined);
    res.json({ reviews });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Добавление отзыва
app.post('/api/marketplace/items/:id/reviews', async (req, res) => {
  try {
    const { MarketplaceService } = require('./services/marketplace.service');
    const review = MarketplaceService.addReview(req.params.id, req.body);
    res.status(201).json({ review });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Покупка товара
app.post('/api/marketplace/purchase', async (req, res) => {
  try {
    const { MarketplaceService } = require('./services/marketplace.service');
    const { userId, itemId, paymentData } = req.body;
    const purchase = MarketplaceService.purchaseItem(userId, itemId, paymentData);
    res.status(201).json({ purchase });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Подтверждение покупки
app.post('/api/marketplace/purchases/:id/confirm', async (req, res) => {
  try {
    const { MarketplaceService } = require('./services/marketplace.service');
    const { transactionId } = req.body;
    const success = MarketplaceService.confirmPurchase(req.params.id, transactionId);
    
    if (!success) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получение покупок пользователя
app.get('/api/marketplace/purchases/:userId', async (req, res) => {
  try {
    const { MarketplaceService } = require('./services/marketplace.service');
    const purchases = MarketplaceService.getUserPurchases(req.params.userId);
    res.json({ purchases });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Проверка покупки
app.get('/api/marketplace/items/:id/purchased', async (req, res) => {
  try {
    const { MarketplaceService } = require('./services/marketplace.service');
    const userId = req.query.userId as string;
    const isPurchased = MarketplaceService.isPurchased(userId, req.params.id);
    res.json({ isPurchased });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получение категорий
app.get('/api/marketplace/categories', async (req, res) => {
  try {
    const { MarketplaceService } = require('./services/marketplace.service');
    const categories = MarketplaceService.getCategories();
    res.json({ categories });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получение популярных товаров
app.get('/api/marketplace/popular', async (req, res) => {
  try {
    const { MarketplaceService } = require('./services/marketplace.service');
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const items = MarketplaceService.getPopularItems(limit);
    res.json({ items });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получение избранных товаров
app.get('/api/marketplace/featured', async (req, res) => {
  try {
    const { MarketplaceService } = require('./services/marketplace.service');
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const items = MarketplaceService.getFeaturedItems(limit);
    res.json({ items });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== PLUGINS ==========

// Получение всех плагинов
app.get('/api/plugins', async (req, res) => {
  try {
    const { pluginsService } = require('./services/plugins.service');
    const plugins = pluginsService.getAllPlugins({
      category: req.query.category as any,
      isActive: req.query.isActive === 'true' ? true : undefined,
      isVerified: req.query.isVerified === 'true' ? true : undefined
    });
    res.json({ plugins });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Регистрация плагина
app.post('/api/plugins', async (req, res) => {
  try {
    const { pluginsService } = require('./services/plugins.service');
    const { name, description, version, author, category, code, config } = req.body;

    // Валидация кода
    const validation = pluginsService.validatePluginCode(code);
    if (!validation.valid) {
      return res.status(400).json({ error: 'Invalid plugin code', details: validation.errors });
    }

    const plugin = pluginsService.registerPlugin({
      name,
      description,
      version,
      author,
      category,
      code,
      config,
      isActive: false,
      isVerified: false
    });

    res.status(201).json({ plugin });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Активация плагина
app.post('/api/plugins/:id/activate', async (req, res) => {
  try {
    const { pluginsService } = require('./services/plugins.service');
    const success = pluginsService.activatePlugin(req.params.id);
    
    if (!success) {
      return res.status(400).json({ error: 'Failed to activate plugin' });
    }

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Деактивация плагина
app.post('/api/plugins/:id/deactivate', async (req, res) => {
  try {
    const { pluginsService } = require('./services/plugins.service');
    const success = pluginsService.deactivatePlugin(req.params.id);
    
    if (!success) {
      return res.status(404).json({ error: 'Plugin not found' });
    }

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Генерация ссылки для шеринга
app.post('/api/projects/:id/share', async (req, res) => {
  try {
    const project = await ProjectsService.getById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    const shareId = Math.random().toString(36).substr(2, 12);
    // В реальной БД мы бы сохранили этот shareId
    res.json({ shareUrl: `https://constructor.ai/view/${shareId}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate share link' });
  }
});

// ========== FINE-TUNING API ==========

// Создание датасета для обучения
app.post('/api/fine-tuning/datasets', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { projectIds, contentType, brandId } = req.body;
    const userId = req.user?.id || 'demo-user';

    if (!projectIds || !Array.isArray(projectIds) || projectIds.length === 0) {
      return res.status(400).json({ error: 'projectIds array is required' });
    }

    if (!['text', 'image', 'layout', 'color'].includes(contentType)) {
      return res.status(400).json({ error: 'Invalid contentType' });
    }

    const dataset = await FineTuningService.createDataset(
      userId,
      projectIds,
      contentType,
      brandId
    );

    res.status(201).json({ dataset });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получение датасетов пользователя
app.get('/api/fine-tuning/datasets', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    const { brandId } = req.query;
    const datasets = FineTuningService.getUserDatasets(userId, brandId as string);
    res.json({ datasets });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Запуск задачи fine-tuning
app.post('/api/fine-tuning/jobs', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { datasetId, modelType, baseModel } = req.body;
    const userId = req.user?.id || 'demo-user';

    if (!datasetId || !modelType) {
      return res.status(400).json({ error: 'datasetId and modelType are required' });
    }

    const job = await FineTuningService.startFineTuningJob(
      datasetId,
      userId,
      modelType,
      baseModel
    );

    res.status(201).json({ job });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получение статуса задачи
app.get('/api/fine-tuning/jobs/:jobId', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    const job = FineTuningService.getJobStatus(req.params.jobId, userId);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ job });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получение всех задач пользователя
app.get('/api/fine-tuning/jobs', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    const jobs = FineTuningService.getUserJobs(userId);
    res.json({ jobs });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Генерация с использованием обученной модели
app.post('/api/fine-tuning/generate', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { modelId, prompt } = req.body;
    const userId = req.user?.id || 'demo-user';

    if (!modelId || !prompt) {
      return res.status(400).json({ error: 'modelId and prompt are required' });
    }

    const result = await FineTuningService.generateWithFineTunedModel(modelId, prompt, userId);
    res.json({ result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Удаление датасета
app.delete('/api/fine-tuning/datasets/:datasetId', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    const success = await FineTuningService.deleteDataset(req.params.datasetId, userId);
    
    if (!success) {
      return res.status(404).json({ error: 'Dataset not found' });
    }

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== ROLE PERMISSIONS API ==========

// Получение всех ролей
app.get('/api/roles', (req, res) => {
  try {
    const roles = RolePermissionsService.getAllRoles();
    const rolesWithInfo = roles.map(role => ({
      role,
      description: RolePermissionsService.getRoleDescription(role),
      permissions: RolePermissionsService.getRolePermissions(role).permissions,
    }));
    res.json({ roles: rolesWithInfo });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получение прав роли
app.get('/api/roles/:role', (req, res) => {
  try {
    const { role } = req.params;
    const permissions = RolePermissionsService.getRolePermissions(role as any);
    
    if (!permissions) {
      return res.status(404).json({ error: 'Role not found' });
    }

    res.json({ role: permissions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Проверка прав доступа
app.post('/api/roles/check-access', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { role, resource, action } = req.body;

    if (!role || !resource || !action) {
      return res.status(400).json({ error: 'role, resource, and action are required' });
    }

    const result = RolePermissionsService.checkAccess(role, resource, action);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получение разрешенных действий для роли на ресурсе
app.get('/api/roles/:role/permissions/:resource', (req, res) => {
  try {
    const { role, resource } = req.params;
    const actions = RolePermissionsService.getAllowedActions(role as any, resource);
    res.json({ role, resource, actions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== THEMES API ==========

// Получение всех тем
app.get('/api/themes', (req, res) => {
  try {
    const { category } = req.query;
    const themes = ThemeService.getAllThemes(category as string);
    res.json({ themes });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получение темы по ID
app.get('/api/themes/:id', (req, res) => {
  try {
    const theme = ThemeService.getThemeById(req.params.id);
    if (!theme) {
      return res.status(404).json({ error: 'Theme not found' });
    }
    res.json({ theme });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Создание темы
app.post('/api/themes', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    const theme = ThemeService.createTheme(userId, req.body);
    res.status(201).json({ theme });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Применение темы к проекту
app.post('/api/projects/:projectId/themes/:themeId/apply', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const theme = ThemeService.applyThemeToProject(req.params.projectId, req.params.themeId);
    if (!theme) {
      return res.status(404).json({ error: 'Theme not found' });
    }
    res.json({ theme, message: 'Theme applied successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получение тем пользователя
app.get('/api/themes/my', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    const themes = ThemeService.getUserThemes(userId);
    res.json({ themes });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Обновление темы
app.put('/api/themes/:id', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    const theme = ThemeService.updateTheme(req.params.id, userId, req.body);
    if (!theme) {
      return res.status(404).json({ error: 'Theme not found' });
    }
    res.json({ theme });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Удаление темы
app.delete('/api/themes/:id', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    const success = ThemeService.deleteTheme(req.params.id, userId);
    if (!success) {
      return res.status(404).json({ error: 'Theme not found' });
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Популярные темы
app.get('/api/themes/popular', (req, res) => {
  try {
    const { limit } = req.query;
    const themes = ThemeService.getPopularThemes(limit ? parseInt(limit as string) : 10);
    res.json({ themes });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== DAM (Digital Asset Management) API ==========

// Настройка multer для загрузки файлов
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

// Загрузка актива
app.post('/api/dam/upload', authenticate, upload.single('file'), async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = req.user?.id || 'demo-user';
    const { projectId, category, tags, isPublic } = req.body;

    const asset = await DAMService.uploadAsset(userId, req.file, {
      projectId,
      category,
      tags: tags ? tags.split(',') : [],
      isPublic: isPublic === 'true',
    });

    res.status(201).json({ asset });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получение активов пользователя
app.get('/api/dam/assets', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    const { type, category, tags, projectId } = req.query;

    const assets = DAMService.getUserAssets(userId, {
      type: type as Asset['type'],
      category: category as string,
      tags: tags ? (tags as string).split(',') : undefined,
      projectId: projectId as string,
    });

    res.json({ assets });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Поиск активов
app.get('/api/dam/search', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    const { q, type, category, tags } = req.query;

    const assets = DAMService.searchAssets(q as string, userId, {
      type: type as Asset['type'],
      category: category as string,
      tags: tags ? (tags as string).split(',') : undefined,
    });

    res.json({ assets });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получение актива по ID
app.get('/api/dam/assets/:id', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const asset = DAMService.getAssetById(req.params.id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    // Проверка доступа
    const userId = req.user?.id || 'demo-user';
    if (asset.userId !== userId && !asset.isPublic) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ asset });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Обновление актива
app.put('/api/dam/assets/:id', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    const asset = DAMService.updateAsset(req.params.id, userId, req.body);
    
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.json({ asset });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Удаление актива
app.delete('/api/dam/assets/:id', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    const success = DAMService.deleteAsset(req.params.id, userId);
    
    if (!success) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Преобразование формата изображения
app.post('/api/dam/assets/:id/convert', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { format, quality } = req.body;
    const asset = await DAMService.convertImageFormat(req.params.id, format, quality);
    
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found or not an image' });
    }

    res.json({ asset });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Оптимизация изображения
app.post('/api/dam/assets/:id/optimize', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { maxWidth, maxHeight, quality } = req.body;
    const asset = await DAMService.optimizeImage(req.params.id, {
      maxWidth,
      maxHeight,
      quality,
    });
    
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found or not an image' });
    }

    res.json({ asset });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получение категорий
app.get('/api/dam/categories', (req, res) => {
  try {
    const categories = DAMService.getCategories();
    res.json({ categories });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Добавление тегов
app.post('/api/dam/assets/:id/tags', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    const { tags } = req.body;
    
    if (!tags || !Array.isArray(tags)) {
      return res.status(400).json({ error: 'tags array is required' });
    }

    const asset = DAMService.addTags(req.params.id, userId, tags);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.json({ asset });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Удаление тегов
app.delete('/api/dam/assets/:id/tags', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    const { tags } = req.body;
    
    if (!tags || !Array.isArray(tags)) {
      return res.status(400).json({ error: 'tags array is required' });
    }

    const asset = DAMService.removeTags(req.params.id, userId, tags);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.json({ asset });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Статистика по активам
app.get('/api/dam/stats', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    const stats = DAMService.getAssetStats(userId);
    res.json({ stats });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== PUSH NOTIFICATIONS API ==========

// Получение уведомлений пользователя
app.get('/api/notifications', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    const { unreadOnly, type, limit } = req.query;
    const notifications = PushNotificationsService.getUserNotifications(userId, {
      unreadOnly: unreadOnly === 'true',
      type: type as any,
      limit: limit ? parseInt(limit as string) : undefined,
    });
    res.json({ notifications });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Отметить уведомление как прочитанное
app.put('/api/notifications/:id/read', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    const success = PushNotificationsService.markAsRead(req.params.id, userId);
    if (!success) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Отметить все уведомления как прочитанные
app.put('/api/notifications/read-all', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    const count = PushNotificationsService.markAllAsRead(userId);
    res.json({ count });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Удалить уведомление
app.delete('/api/notifications/:id', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    const success = PushNotificationsService.deleteNotification(req.params.id, userId);
    if (!success) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получить количество непрочитанных уведомлений
app.get('/api/notifications/unread-count', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    const count = PushNotificationsService.getUnreadCount(userId);
    res.json({ count });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получить настройки уведомлений
app.get('/api/notifications/preferences', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    const preferences = PushNotificationsService.getPreferences(userId);
    res.json({ preferences });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Обновить настройки уведомлений
app.put('/api/notifications/preferences', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    const preferences = PushNotificationsService.updatePreferences(userId, req.body);
    res.json({ preferences });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== REFERRAL PROGRAM API ==========

// Получить реферальную ссылку
app.get('/api/referrals/link', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    const { type } = req.query;
    const link = ReferralService.generateReferralLink(userId, (type as 'user' | 'seller') || 'user');
    res.json({ link });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Регистрация реферала
app.post('/api/referrals/register', async (req, res) => {
  try {
    const { referrerId, referredEmail, type, referralCode } = req.body;
    const referral = await ReferralService.registerReferral(referrerId, referredEmail, type, referralCode);
    res.status(201).json({ referral });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получить статистику рефералов
app.get('/api/referrals/stats', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    const stats = ReferralService.getReferralStats(userId);
    res.json({ stats });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получить список рефералов
app.get('/api/referrals', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id || 'demo-user';
    const { status } = req.query;
    const referrals = ReferralService.getReferrals(userId, status as any);
    res.json({ referrals });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получить активную программу
app.get('/api/referrals/program', (req, res) => {
  try {
    const program = ReferralService.getActiveProgram();
    if (!program) {
      return res.status(404).json({ error: 'No active program' });
    }
    res.json({ program });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== PRODUCT ANALYTICS API ==========

// Отслеживание события
app.post('/api/analytics/track', (req, res) => {
  try {
    const { eventName, properties, userId, sessionId, platform } = req.body;
    const event = ProductAnalyticsService.trackEvent(eventName, properties, {
      userId,
      sessionId,
      platform,
      userAgent: req.get('user-agent'),
      ip: req.ip,
    });
    res.status(201).json({ event });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Статистика использования функций
app.get('/api/analytics/features', (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const stats = ProductAnalyticsService.getFeatureUsageStats(
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );
    res.json({ stats });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Топ функций
app.get('/api/analytics/top-features', (req, res) => {
  try {
    const { limit } = req.query;
    const features = ProductAnalyticsService.getTopFeatures(
      limit ? parseInt(limit as string) : 10
    );
    res.json({ features });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== CONTENT LOCALIZATION API ==========

// Получить поддерживаемые локали
app.get('/api/localization/locales', (req, res) => {
  try {
    const locales = ContentLocalizationService.getSupportedLocales();
    res.json({ locales });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Получить локализованный контент
app.get('/api/localization/content', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { projectId, elementId, locale } = req.query;
    if (!projectId || !elementId || !locale) {
      return res.status(400).json({ error: 'projectId, elementId, and locale are required' });
    }
    const content = ContentLocalizationService.getLocalizedContent(
      projectId as string,
      elementId as string,
      locale as string
    );
    res.json({ content });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Установить локализованный контент
app.post('/api/localization/content', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { projectId, elementId, elementType, locale, content, metadata } = req.body;
    const localized = ContentLocalizationService.setLocalizedContent(
      projectId,
      elementId,
      elementType,
      locale,
      content,
      metadata
    );
    res.status(201).json({ localized });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Автоматический перевод
app.post('/api/localization/translate', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { projectId, elementId, sourceLocale, targetLocale, sourceContent } = req.body;
    const translated = await ContentLocalizationService.autoTranslate(
      projectId,
      elementId,
      sourceLocale,
      targetLocale,
      sourceContent
    );
    res.json({ translated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Статистика локализации проекта
app.get('/api/localization/stats/:projectId', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const stats = ContentLocalizationService.getLocalizationStats(req.params.projectId);
    res.json({ stats });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== AGENTS & TASKS ==========

app.post('/api/agents/register', async (req, res) => {
  try {
    const { name, type, capabilities } = req.body;
    const agent = await AgentService.registerAgent(name, type, capabilities);
    res.json(agent);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects/:id/tasks', async (req, res) => {
  try {
    const { title, inputData } = req.body;
    const task = await AgentService.createTask(req.params.id, title, inputData);
    res.json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== RAG & KNOWLEDGE BASE ==========

app.post('/api/knowledge/index', async (req, res) => {
  try {
    const { knowledgeBaseId, name, type, content } = req.body;
    const doc = await RagService.indexDocument(knowledgeBaseId, name, type, content);
    res.json(doc);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/knowledge/search', async (req, res) => {
  try {
    const { q, knowledgeBaseId } = req.query;
    const results = await RagService.searchKnowledge(knowledgeBaseId as string, q as string);
    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== DATA TABLES ==========

app.post('/api/projects/:id/tables', async (req, res) => {
  try {
    const { name, schema } = req.body;
    const table = await DataTableService.createTable(req.params.id, name, schema);
    res.json(table);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tables/:id/rows', async (req, res) => {
  try {
    const row = await DataTableService.insertRow(req.params.id, req.body);
    res.json(row);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== VERSIONING ==========

app.post('/api/projects/:id/versions', async (req, res) => {
  try {
    const { name, description } = req.body;
    const version = await VersioningService.createVersion(req.params.id, name, description);
    res.json(version);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/versions/:id/restore', async (req, res) => {
  try {
    const project = await VersioningService.restoreVersion(req.params.id);
    res.json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== AUDIT LOGS ==========

app.get('/api/admin/audit-logs', async (req, res) => {
  try {
    const { organizationId, limit } = req.query;
    const logs = await AuditLogService.getOrganizationLogs(organizationId as string, parseInt(limit as string) || 100);
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Эндпоинт для метрик
app.get('/api/metrics', (req, res) => {
  const { metrics } = require('./utils/metrics');
  const stats = {
    http_requests: metrics.getStats('http_requests_total'),
    request_duration: metrics.getStats('http_request_duration'),
    all_metrics: metrics.getMetrics()
  };
  res.json(stats);
});

// Обработка ошибок (должен быть последним middleware)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Используем улучшенный обработчик ошибок с логированием
  EnhancedErrorHandler.handleApiError(err, req, res, next);
});

// Обработка необработанных ошибок
process.on('unhandledRejection', (reason, promise) => {
  EnhancedErrorHandler.handleUnhandledRejection(reason, promise);
});

process.on('uncaughtException', (error) => {
  EnhancedErrorHandler.handleUncaughtException(error);
});

// Инициализация HTTP сервера для WebSocket
const server = app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
  console.log(`AI Mode: ${AI_CONFIG.useMock ? 'MOCK (заглушки)' : 'REAL (требуются API ключи)'}`);
  
  // Инициализация WebSocket сервера для realtime синхронизации
  const { realtimeSyncService } = require('./services/realtime-sync.service');
  realtimeSyncService.initialize(server);
  console.log('Realtime sync service initialized');

  // Initialize AI Agents
  AgentService.initDefaultAgents().catch(err => console.error('Agent init fail:', err));
});
