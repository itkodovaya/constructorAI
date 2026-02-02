import axios from 'axios';
import { handleApiError, showErrorNotification } from '../utils/errorHandler';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Создаем axios instance с базовой конфигурацией
const apiClient = axios.create({
  baseURL: API_URL.endsWith('/') ? API_URL : API_URL + '/',
  timeout: 60000, // Увеличиваем таймаут до 60 секунд для генерации
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token') || 'demo-token'}`,
  },
});

// Interceptor для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const method = error.config?.method || '';
    const status = error.response?.status;
    
    // Публичные эндпоинты - не показываем ошибки
    const isPublicEndpoint = (
      (url.includes('projects') && method === 'get') ||
      url.includes('health') ||
      url.includes('api-docs')
    );
    
    // В демо-режиме не показываем ошибки аутентификации
    const isAuthError = status === 401;
    
    // Логируем все ошибки в консоль для отладки
    console.log('API Error:', { url, method, status, isPublicEndpoint, isAuthError });
    
    // Показываем ошибки только если это не публичный эндпоинт и не ошибка аутентификации
    if (!isPublicEndpoint && !isAuthError && status !== 401) {
      const message = handleApiError(error);
      showErrorNotification(message);
    }
    
    return Promise.reject(error);
  }
);

export const api = {
  async getProjects() {
    const response = await apiClient.get('projects');
    return response.data;
  },
  async getProject(id: string) {
    const response = await apiClient.get(`projects/${id}`);
    return response.data;
  },
  async createProject(data: any) {
    // Убираем сложные объекты, которые могут вызвать проблемы при сериализации
    const cleanData = {
      brandName: data.brandName,
      niche: data.niche,
      style: data.style || 'minimalist',
      colors: data.colors || [],
      goals: data.goals || [],
      metadata: data.metadata ? JSON.parse(JSON.stringify(data.metadata)) : undefined, // Глубокая сериализация
    };
    console.log('[API] Creating project with data:', cleanData);
    const response = await apiClient.post('projects', cleanData);
    return response.data;
  },
  async updateProject(id: string, data: any) {
    const response = await apiClient.put(`projects/${id}`, data);
    return response.data;
  },
  async deleteProject(id: string) {
    await apiClient.delete(`projects/${id}`);
  },
  async exportProject(id: string) {
    const response = await apiClient.post(`projects/${id}/export`, {}, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `website.html`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
  async shareProject(id: string) {
    const response = await apiClient.post(`projects/${id}/share`);
    return response.data;
  },
  async generateFullContent(id: string) {
    const response = await apiClient.post(`projects/${id}/generate-content`);
    return response.data;
  },
  async translateProject(id: string, lang: 'ru' | 'en') {
    const response = await apiClient.post(`projects/${id}/translate`, { lang });
    return response.data;
  },
  // AI Site Architect & Content Strategy
  async generateSiteStructure(data: { brandName: string; niche: string; goals: string[] }) {
    const response = await apiClient.post('ai/site-structure', data);
    return response.data;
  },
  async generateContentStrategy(data: { brandName: string; niche: string; targetAudience: string }) {
    const response = await apiClient.post('ai/content-strategy', data);
    return response.data;
  },
  async optimizeLayout(data: { blocks: any[]; conversionGoals: string[] }) {
    const response = await apiClient.post('ai/optimize-layout', data);
    return response.data;
  },
  async generateColorScheme(data: { brandName: string; niche: string; brandPersonality: string[] }) {
    const response = await apiClient.post('ai/color-scheme', data);
    return response.data;
  },
  async generateCopy(data: { blockType: string; context: any }) {
    const response = await apiClient.post('ai/copy', data);
    return response.data;
  },
  async generateABTestVariants(data: { originalBlock: any; testType: string }) {
    const response = await apiClient.post('ai/ab-test-variants', data);
    return response.data;
  },
  async personalizeContent(data: { block: any; userSegment: any }) {
    const response = await apiClient.post('ai/personalize-content', data);
    return response.data;
  },
  async getSiteRecommendations(data: { siteData: any }) {
    const response = await apiClient.post('ai/site-recommendations', data);
    return response.data;
  },
  getPreviewUrl(id: string): string {
    return `${API_URL}/projects/${id}/preview`;
  },
  async exportPresentation(id: string) {
    const response = await apiClient.post(`projects/${id}/export-presentation`);
    return response.data;
  },
  async exportBrandKit(id: string) {
    const response = await apiClient.post(`projects/${id}/export-brandkit`, {}, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `brandkit.zip`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
  async generateBatchSocialPosts(id: string, formats: any[], content: any) {
    const response = await apiClient.post(
      `projects/${id}/generate-social-posts`,
      { formats, content },
      { responseType: 'blob' }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `social_posts.zip`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
  async generateBlockContent(id: string, blockType: string) {
    const response = await apiClient.post(`projects/${id}/generate-block-content`, { blockType });
    return response.data;
  },
  async generateSocialPostsAI(id: string, count: number, platforms: string[]) {
    const response = await apiClient.post(`projects/${id}/generate-social-posts-ai`, { count, platforms });
    return response.data;
  },
  async queueAITask(type: 'text' | 'image' | 'translate', prompt: string, options?: any) {
    const response = await apiClient.post(`ai/queue-task`, { type, prompt, options });
    return response.data;
  },
  async getAITaskStatus(taskId: string) {
    const response = await apiClient.get(`ai/task/${taskId}`);
    return response.data;
  },
  // Аутентификация
  async register(email: string, password: string, name: string) {
    const response = await apiClient.post(`auth/register`, { email, password, name });
    return response.data;
  },
  async login(email: string, password: string) {
    const response = await apiClient.post(`auth/login`, { email, password });
    return response.data;
  },
  async getCurrentUser() {
    try {
      const response = await apiClient.get(`auth/me`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        return null;
      }
      throw error;
    }
  },
  async getPlans() {
    const response = await apiClient.get(`plans`);
    return response.data;
  },
  async upgradePlan(plan: 'pro' | 'brandkit') {
    const response = await apiClient.post(`auth/upgrade-plan`, { plan });
    return response.data;
  },
  // Коллаборация
  async inviteCollaborator(projectId: string, email: string, role: 'owner' | 'editor' | 'viewer') {
    const response = await apiClient.post(`projects/${projectId}/invite`, { email, role });
    return response.data;
  },
  async acceptInvitation(invitationId: string) {
    const response = await apiClient.post(`invitations/${invitationId}/accept`);
    return response.data;
  },
  async getCollaborators(projectId: string) {
    const response = await apiClient.get(`projects/${projectId}/collaborators`);
    return response.data;
  },
  async removeCollaborator(projectId: string, userId: string) {
    await apiClient.delete(`projects/${projectId}/collaborators/${userId}`);
  },
  // Маркетплейс шаблонов
  async getTemplates(filters?: {
    category?: string;
    search?: string;
    minRating?: number;
    maxPrice?: number;
    featured?: boolean;
    tags?: string[];
  }) {
    const response = await apiClient.get('templates', { params: filters });
    return response.data;
  },
  
  // AI Chat Assistant
  async chatWithAI(projectId: string, message: string) {
    const response = await apiClient.post(`ai/chat`, {
      projectId,
      message
    });
    return response.data;
  },
  
  async getAISuggestions(projectId: string, type: 'layout' | 'text' | 'image' | 'color') {
    const response = await apiClient.get(`ai/suggestions/${projectId}`, {
      params: { type }
    });
    return response.data;
  },
  async getTemplate(id: string) {
    const response = await apiClient.get(`templates/${id}`);
    return response.data;
  },
  async downloadTemplate(id: string) {
    const response = await apiClient.post(`templates/${id}/download`);
    return response.data;
  },
  async addTemplateReview(templateId: string, rating: number, comment: string) {
    const response = await apiClient.post(`templates/${templateId}/reviews`, { rating, comment });
    return response.data;
  },
  async getTemplateReviews(templateId: string) {
    const response = await apiClient.get(`templates/${templateId}/reviews`);
    return response.data;
  },
  async getTemplateCategories() {
    const response = await apiClient.get(`templates/categories`);
    return response.data;
  },
  async getPopularTemplates(limit: number = 10) {
    const response = await apiClient.get(`templates/popular`, { params: { limit } });
    return response.data;
  },
  
  // Comments System
  async getComments(projectId: string) {
    const response = await apiClient.get(`projects/${projectId}/comments`);
    return response.data.comments;
  },
  
  async getElementComments(projectId: string, elementId: string) {
    const response = await apiClient.get(`projects/${projectId}/comments/element/${elementId}`);
    return response.data.comments;
  },
  
  async getCommentThreads(projectId: string) {
    const response = await apiClient.get(`projects/${projectId}/comments/threads`);
    return response.data.threads;
  },
  
  async addComment(projectId: string, data: {
    elementId: string;
    elementType: 'block' | 'slide' | 'page' | 'asset';
    userId: string;
    userName: string;
    content: string;
    position?: { x: number; y: number };
    parentId?: string;
  }) {
    const response = await apiClient.post(`projects/${projectId}/comments`, data);
    return response.data.comment;
  },
  
  async updateComment(projectId: string, commentId: string, updates: any) {
    const response = await apiClient.put(`projects/${projectId}/comments/${commentId}`, updates);
    return response.data.comment;
  },
  
  async deleteComment(projectId: string, commentId: string) {
    await apiClient.delete(`projects/${projectId}/comments/${commentId}`);
  },
  
  async resolveComment(projectId: string, commentId: string) {
    const response = await apiClient.post(`projects/${projectId}/comments/${commentId}/resolve`);
    return response.data.comment;
  },
  
  async getCommentStats(projectId: string) {
    const response = await apiClient.get(`projects/${projectId}/comments/stats`);
    return response.data.stats;
  },
  
  // Semantic Search
  async semanticSearch(query: string, type?: 'template' | 'block' | 'asset' | 'slide', limit?: number) {
    const response = await apiClient.post(`search/semantic`, {
      query,
      type,
      limit: limit || 10
    });
    return response.data.results;
  },
  
  async findSimilar(itemId: string, limit?: number) {
    const response = await apiClient.get(`search/similar/${itemId}`, {
      params: { limit: limit || 5 }
    });
    return response.data.results;
  },
  
  async indexItem(id: string, type: 'template' | 'block' | 'asset' | 'slide', text: string, metadata?: any) {
    const response = await apiClient.post(`search/index`, {
      id,
      type,
      text,
      metadata
    });
    return response.data;
  },
  
  async getSearchStats() {
    const response = await apiClient.get(`search/stats`);
    return response.data.stats;
  },
  
  // Custom Components
  async getMyComponents(userId: string) {
    const response = await apiClient.get(`components/my`, {
      params: { userId }
    });
    return response.data.components;
  },
  
  async getPublicComponents(filters?: {
    category?: string;
    search?: string;
    tags?: string[];
    limit?: number;
  }) {
    const response = await apiClient.get(`components/public`, { params: filters });
    return response.data.components;
  },
  
  async createComponent(data: {
    userId: string;
    name: string;
    description: string;
    category: string;
    code: string;
    props?: any[];
    preview?: string;
    tags?: string[];
    isPublic?: boolean;
  }) {
    const response = await apiClient.post(`components`, data);
    return response.data.component;
  },
  
  async installComponent(componentId: string, userId: string) {
    const response = await apiClient.post(`components/${componentId}/install`, { userId });
    return response.data;
  },
  
  // Plugins
  async getPlugins(filters?: {
    category?: string;
    isActive?: boolean;
    isVerified?: boolean;
  }) {
    const response = await apiClient.get(`plugins`, { params: filters });
    return response.data.plugins;
  },
  
  async registerPlugin(data: {
    name: string;
    description: string;
    version: string;
    author: string;
    category: string;
    code: string;
    config: any;
  }) {
    const response = await apiClient.post(`plugins`, data);
    return response.data.plugin;
  },
  
  async activatePlugin(pluginId: string) {
    const response = await apiClient.post(`plugins/${pluginId}/activate`);
    return response.data;
  },
  
  async deactivatePlugin(pluginId: string) {
    const response = await apiClient.post(`plugins/${pluginId}/deactivate`);
    return response.data;
  },
  
  // A/B Tests
  async getABTests(projectId: string) {
    const response = await apiClient.get(`projects/${projectId}/ab-tests`);
    return response.data.tests;
  },
  
  async createABTest(projectId: string, data: any) {
    const response = await apiClient.post(`projects/${projectId}/ab-tests`, data);
    return response.data.test;
  },
  
  async getVariant(testId: string, sessionId: string) {
    const response = await apiClient.get(`ab-tests/${testId}/variant`, {
      params: { sessionId }
    });
    return response.data;
  },
  
  async recordConversion(testId: string, sessionId: string, goalData?: any) {
    const response = await apiClient.post(`ab-tests/${testId}/conversion`, {
      sessionId,
      goalData
    });
    return response.data;
  },
  
  async getABTestResults(testId: string) {
    const response = await apiClient.get(`ab-tests/${testId}/results`);
    return response.data.results;
  },
  
  async startABTest(testId: string) {
    const response = await apiClient.post(`ab-tests/${testId}/start`);
    return response.data;
  },
  
  async pauseABTest(testId: string) {
    const response = await apiClient.post(`ab-tests/${testId}/pause`);
    return response.data;
  },
  
  async completeABTest(testId: string) {
    const response = await apiClient.post(`ab-tests/${testId}/complete`);
    return response.data;
  },
  
  // Marketplace
  async getMarketplaceItems(filters?: any) {
    const response = await apiClient.get(`marketplace/items`, { params: filters });
    return response.data;
  },
  
  async getMarketplaceItem(itemId: string) {
    const response = await apiClient.get(`marketplace/items/${itemId}`);
    return response.data.item;
  },
  
  async createMarketplaceItem(data: any) {
    const response = await apiClient.post(`marketplace/items`, data);
    return response.data.item;
  },
  
  async getItemReviews(itemId: string, limit?: number) {
    const response = await apiClient.get(`marketplace/items/${itemId}/reviews`, { params: { limit } });
    return response.data.reviews;
  },
  
  async addItemReview(itemId: string, data: { userId: string; userName: string; rating: number; comment: string }) {
    const response = await apiClient.post(`marketplace/items/${itemId}/reviews`, data);
    return response.data.review;
  },
  
  async purchaseItem(userId: string, itemId: string, paymentData?: any) {
    const response = await apiClient.post(`marketplace/purchase`, { userId, itemId, paymentData });
    return response.data.purchase;
  },
  
  async confirmPurchase(purchaseId: string, transactionId: string) {
    const response = await apiClient.post(`marketplace/purchases/${purchaseId}/confirm`, { transactionId });
    return response.data;
  },
  
  async getUserPurchases(userId: string) {
    const response = await apiClient.get(`marketplace/purchases/${userId}`);
    return response.data.purchases;
  },
  
  async isItemPurchased(userId: string, itemId: string) {
    const response = await apiClient.get(`marketplace/items/${itemId}/purchased`, {
      params: { userId }
    });
    return response.data.isPurchased;
  },
  
  async getMarketplaceCategories() {
    const response = await apiClient.get(`marketplace/categories`);
    return response.data.categories;
  },
  
  async getPopularItems(limit: number = 10) {
    const response = await apiClient.get(`marketplace/popular`, { params: { limit } });
    return response.data.items;
  },
  
  async getFeaturedItems(limit: number = 10) {
    const response = await apiClient.get(`marketplace/featured`, { params: { limit } });
    return response.data.items;
  },
  
  // Leads & CRM
  async getLeads(projectId: string) {
    const response = await apiClient.get(`projects/${projectId}/leads`);
    return response.data;
  },
  
  async updateLeadStatus(leadId: string, status: string) {
    const response = await apiClient.put(`leads/${leadId}/status`, { status });
    return response.data;
  },

  async updateLead(leadId: string, data: any) {
    const response = await apiClient.patch(`leads/${leadId}`, data);
    return response.data;
  },

  async deleteLead(leadId: string) {
    await apiClient.delete(`leads/${leadId}`);
  },

  // Asset Management (DAM)
  async getAssets(filters?: any) {
    const response = await apiClient.get(`dam/assets`, { params: filters });
    return response.data.assets;
  },

  async uploadAsset(formData: FormData) {
    const response = await apiClient.post(`dam/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.asset;
  },

  async deleteAsset(id: string) {
    await apiClient.delete(`dam/assets/${id}`);
  },

  async getDamStats() {
    const response = await apiClient.get(`dam/stats`);
    return response.data.stats;
  },

  // Products & E-commerce
  async getProducts(projectId: string) {
    const response = await apiClient.get(`projects/${projectId}/products`);
    return response.data;
  },

  async createProduct(projectId: string, data: any) {
    const response = await apiClient.post(`projects/${projectId}/products`, data);
    return response.data.product;
  },

  async updateProduct(id: string, data: any) {
    const response = await apiClient.put(`products/${id}`, data);
    return response.data.product;
  },

  async deleteProduct(id: string) {
    await apiClient.delete(`products/${id}`);
  },

  async getCategories(projectId: string) {
    const response = await apiClient.get(`projects/${projectId}/categories`);
    return response.data;
  },

  async createCategory(projectId: string, name: string) {
    const response = await apiClient.post(`projects/${projectId}/categories`, { name });
    return response.data.category;
  },

  async getAiSuggestions(projectId: string) {
    const response = await apiClient.get(`projects/${projectId}/ai-suggestions`);
    return response.data.suggestions;
  },

  // Blog & CMS
  async getPosts(projectId: string) {
    const response = await apiClient.get(`projects/${projectId}/posts`);
    return response.data;
  },

  async createPost(projectId: string, data: any) {
    const response = await apiClient.post(`projects/${projectId}/posts`, data);
    return response.data.post;
  },

  async updatePost(id: string, data: any) {
    const response = await apiClient.put(`posts/${id}`, data);
    return response.data.post;
  },

  async deletePost(id: string) {
    await apiClient.delete(`posts/${id}`);
  },

  // Templates
  async getTemplates(projectId?: string, type?: string) {
    const response = await apiClient.get(`templates`, { params: { projectId, type } });
    return response.data.templates;
  },

  async saveTemplate(data: any) {
    const response = await apiClient.post(`templates`, data);
    return response.data.template;
  },

  async deleteTemplate(id: string) {
    await apiClient.delete(`templates/${id}`);
  },

  // Integrations
  async getIntegrations(projectId: string) {
    const response = await apiClient.get(`projects/${projectId}/integrations`);
    return response.data.integrations;
  },

  async getForecast(projectId: string) {
    const response = await apiClient.get(`projects/${projectId}/forecast`);
    return response.data;
  },

  async createIntegration(projectId: string, data: any) {
    const response = await apiClient.post(`projects/${projectId}/integrations`, data);
    return response.data.integration;
  },

  async deleteIntegration(id: string) {
    await apiClient.delete(`integrations/${id}`);
  },

  // Autopilot
  async bulkGeneratePosts(projectId: string, niche: string, count: number = 5) {
    const response = await apiClient.post(`ai/autopilot/bulk-posts/${projectId}`, { niche, count });
    return response.data.posts;
  },

  async generateProductCopy(productName: string, features: string[]) {
    const response = await apiClient.post(`ai/autopilot/product-copy`, { productName, features });
    return response.data.copy;
  },

  // Collaboration
  async getCollaborators(projectId: string) {
    const response = await apiClient.get(`projects/${projectId}/collaborators`);
    return response.data;
  },

  async inviteCollaborator(projectId: string, email: string, role: string) {
    const response = await apiClient.post(`projects/${projectId}/invite`, { email, role });
    return response.data;
  },

  async removeCollaborator(projectId: string, userId: string) {
    await apiClient.delete(`projects/${projectId}/collaborators/${userId}`);
  },

  async transferProject(projectId: string, email: string) {
    await apiClient.post(`projects/${projectId}/transfer`, { email });
  },

  // Workspaces
  async getWorkspaces(userId: string) {
    const response = await apiClient.get(`workspaces`, { params: { userId } });
    return response.data.workspaces;
  },

  async createWorkspace(name: string, ownerId: string) {
    const response = await apiClient.post(`workspaces`, { name, ownerId });
    return response.data.workspace;
  },

  // Knowledge Base
  async getKnowledgeBases(orgId: string) {
    const response = await apiClient.get(`organizations/${orgId}/knowledge`);
    return response.data.knowledgeBases;
  },

  async createKnowledgeBase(orgId: string, name: string, description?: string) {
    const response = await apiClient.post(`organizations/${orgId}/knowledge`, { name, description });
    return response.data.knowledgeBase;
  },

  async addDocument(kbId: string, name: string, type: string, content: string) {
    const response = await apiClient.post(`knowledge/${kbId}/documents`, { name, type, content });
    return response.data.document;
  },

  // Agents & Tasks
  async getAgents() {
    const response = await apiClient.get(`agents`);
    return response.data.agents;
  },

  async updateAgent(id: string, data: any) {
    const response = await apiClient.patch(`agents/${id}`, data);
    return response.data;
  },

  async getProjectTasks(projectId: string) {
    const response = await apiClient.get(`projects/${projectId}/tasks`);
    return response.data.tasks;
  },

  async createAgentTask(projectId: string, data: any) {
    const response = await apiClient.post(`projects/${projectId}/tasks`, data);
    return response.data.task;
  },

  async addTaskMessage(taskId: string, senderId: string, content: string, type: string = 'text') {
    const response = await apiClient.post(`tasks/${taskId}/messages`, { senderId, content, type });
    return response.data.message;
  },

  async initiateSwarm(taskId: string) {
    await apiClient.post(`tasks/${taskId}/swarm`);
  },

  async synthesizeComponent(description: string, brandContext: any) {
    const response = await apiClient.post(`ai/synthesize`, { description, brandContext });
    return response.data.html;
  },

  async sendVoiceCommand(projectId: string, transcript: string) {
    const response = await apiClient.post(`ai/voice-command/${projectId}`, { transcript });
    return response.data;
  },

  async generateImageVariants(prompt: string, count: number = 4) {
    const response = await apiClient.post(`ai/image-variants`, { prompt, count });
    return response.data.variants;
  },

  async generateLogo(brandName: string, personality: string) {
    const response = await apiClient.post(`ai/logo`, { brandName, personality });
    return response.data.logoUrl;
  },

  async generateSVGPattern(vibe: string) {
    const response = await apiClient.post(`ai/svg-pattern`, { vibe });
    return response.data.svg;
  },

  async generateCustomIcon(prompt: string) {
    const response = await apiClient.post(`ai/icon`, { prompt });
    return response.data.svg;
  },

  async generateSpeech(text: string) {
    const response = await apiClient.post(`ai/text-to-speech`, { text });
    return response.data.audioUrl;
  },

  async runVisionAudit(imageData: string) {
    const response = await apiClient.post(`ai/vision-audit`, { imageData });
    return response.data;
  },

  async autoEvolve(projectId: string, blockId: string, blockType: string) {
    const response = await apiClient.post(`ai/auto-evolve/${projectId}`, { blockId, blockType });
    return response.data;
  },

  async semanticSearch(projectId: string, query: string) {
    const response = await apiClient.get(`projects/${projectId}/semantic-search`, { params: { query } });
    return response.data.results;
  },

  async sendOmniCommand(projectId: string, prompt: string) {
    const response = await apiClient.post(`ai/omni-command/${projectId}`, { prompt });
    return response.data;
  },

  async analyzeVibe(events: any[]) {
    const response = await apiClient.post(`ai/analyze-vibe`, { events });
    return response.data;
  },

  async runGrowthSimulation(data: { currentLeads: number, conversionRate: number, marketingSpend: number, increase: number }) {
    const response = await apiClient.post(`ai/simulate-growth`, data);
    return response.data;
  },

  async createMarketingCampaign(projectId: string, data: { goal: string, channels: string[] }) {
    const response = await apiClient.post(`ai/marketing-campaign/${projectId}`, data);
    return response.data;
  },

  async updatePersonalizationRules(projectId: string, rules: any[]) {
    const response = await apiClient.patch(`projects/${projectId}/personalization`, { rules });
    return response.data;
  },

  async auditCompliance(content: string) {
    const response = await apiClient.post(`ai/audit-compliance`, { content });
    return response.data;
  },

  async generateMotionSequence(description: string) {
    const response = await apiClient.post(`ai/motion-sequence`, { description });
    return response.data;
  },

  async generateVideoBackground(prompt: string) {
    const response = await apiClient.post(`ai/video-background`, { prompt });
    return response.data.videoUrl;
  },

  // AI Governance
  async logAIDecision(data: { action: string; projectId?: string; model?: string; prompt?: string; response?: string; reasoning?: string; confidence?: number; metadata?: any }) {
    const response = await apiClient.post(`governance/decisions`, data);
    return response.data.decision;
  },

  async getGovernanceDashboard(organizationId?: string, startDate?: string, endDate?: string) {
    const params: any = {};
    if (organizationId) params.organizationId = organizationId;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await apiClient.get(`governance/dashboard`, { params });
    return response.data;
  },

  async getAIUsageStats(projectId?: string, startDate?: string, endDate?: string) {
    const params: any = {};
    if (projectId) params.projectId = projectId;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await apiClient.get(`governance/usage`, { params });
    return response.data;
  },

  async getProjectAIDecisions(projectId: string, limit?: number) {
    const params: any = {};
    if (limit) params.limit = limit;
    const response = await apiClient.get(`projects/${projectId}/governance/decisions`, { params });
    return response.data.decisions;
  },

  async exportGovernanceData(organizationId?: string, startDate?: string, endDate?: string) {
    const params: any = {};
    if (organizationId) params.organizationId = organizationId;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await apiClient.get(`governance/export`, { params });
    return response.data;
  },

  // Compliance Auditor
  async runComplianceAudit(data: { auditType: string; projectId?: string; content?: string; data?: any }) {
    const response = await apiClient.post(`compliance/audit`, data);
    return response.data.audit;
  },

  async getComplianceReport(projectId?: string, startDate?: string, endDate?: string) {
    const params: any = {};
    if (projectId) params.projectId = projectId;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await apiClient.get(`compliance/report`, { params });
    return response.data;
  },

  async getComplianceAudits(projectId?: string, limit?: number) {
    const params: any = {};
    if (projectId) params.projectId = projectId;
    if (limit) params.limit = limit;
    const response = await apiClient.get(`compliance/audits`, { params });
    return response.data.audits;
  },

  async exportComplianceData(projectId?: string) {
    const params: any = {};
    if (projectId) params.projectId = projectId;
    const response = await apiClient.get(`compliance/export`, { params });
    return response.data;
  },

  async trackCorrection(projectId: string, data: { blockType: string, originalContent: any, newContent: any }) {
    await apiClient.post(`projects/${projectId}/track-correction`, data);
  },

  // AI Site Generator
  async generateSiteStructure(data: { brandName: string; niche: string; goals: string[]; projectId?: string }) {
    const response = await apiClient.post('ai/site-structure', data);
    return response.data;
  },

  async generateContentStrategy(data: { brandName: string; niche: string; targetAudience: string; projectId?: string }) {
    const response = await apiClient.post('ai/content-strategy', data);
    return response.data;
  },

  async optimizeLayout(data: { blocks: any[]; conversionGoals: string[]; projectId?: string }) {
    const response = await apiClient.post('ai/optimize-layout', data);
    return response.data;
  },

  async generateColorScheme(data: { brandName: string; niche: string; brandPersonality: string[]; projectId?: string }) {
    const response = await apiClient.post('ai/color-scheme', data);
    return response.data;
  },

  async generateCopy(data: { blockType: string; context: any; projectId?: string }) {
    const response = await apiClient.post('ai/copy', data);
    return response.data;
  },

  async generateABTestVariants(data: { originalBlock: any; testType: string; projectId?: string }) {
    const response = await apiClient.post('ai/ab-test-variants', data);
    return response.data;
  },

  async personalizeContent(data: { block: any; userSegment: any; projectId?: string }) {
    const response = await apiClient.post('ai/personalize-content', data);
    return response.data;
  },

  async getSiteRecommendations(data: { siteData: any; projectId?: string }) {
    const response = await apiClient.post('ai/site-recommendations', data);
    return response.data;
  },

  async generateSEOContent(projectId: string, data: { currentSEO?: any; pages?: string[] }) {
    const response = await apiClient.post(`projects/${projectId}/generate-seo`, data);
    return response.data;
  },

  async updateProjectSEO(projectId: string, seoData: any) {
    const response = await apiClient.put(`projects/${projectId}/seo`, seoData);
    return response.data;
  },

  // Enhanced AI Features
  async generateWithContext(data: {
    brandName: string;
    niche: string;
    goals: string[];
    competitors?: string[];
    targetAudience?: string;
    projectId?: string;
  }) {
    const response = await apiClient.post('ai/generate-with-context', data);
    return response.data;
  },

  async generateMultiLanguageContent(data: {
    content: string;
    sourceLanguage: string;
    targetLanguages: string[];
    preserveTone?: boolean;
    projectId?: string;
  }) {
    const response = await apiClient.post('ai/multi-language', data);
    return response.data;
  },

  async getDesignSuggestions(data: {
    currentDesign: any;
    goals: string[];
    analytics?: any;
    projectId?: string;
  }) {
    const response = await apiClient.post('ai/design-suggestions', data);
    return response.data;
  },

  async generateSEOContent(data: {
    topic: string;
    keywords: string[];
    targetLength?: number;
    projectId?: string;
  }) {
    const response = await apiClient.post('ai/seo-content', data);
    return response.data;
  },

  async generateContentVariations(data: {
    originalContent: string;
    count?: number;
    projectId?: string;
  }) {
    const response = await apiClient.post('ai/content-variations', data);
    return response.data;
  }
};
