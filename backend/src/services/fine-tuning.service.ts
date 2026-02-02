/**
 * Сервис для обучения моделей на пользовательских данных (fine-tuning)
 * Поддерживает обучение на основе успешных проектов пользователя
 */

import { ProjectsService } from './projects.service';
import { BrandService } from './brand.service';
import { v4 as uuidv4 } from 'uuid';

export interface TrainingDataset {
  id: string;
  userId: string;
  brandId?: string; // Для сегрегации по брендам
  projectIds: string[];
  contentType: 'text' | 'image' | 'layout' | 'color';
  samples: TrainingSample[];
  createdAt: Date;
  status: 'pending' | 'training' | 'completed' | 'failed';
  modelId?: string; // ID обученной модели
}

export interface TrainingSample {
  id: string;
  input: string; // Промпт или описание
  output: string; // Результат (текст, JSON структуры, цвета и т.д.)
  metadata?: Record<string, any>;
}

export interface FineTuningJob {
  id: string;
  datasetId: string;
  userId: string;
  modelType: 'text' | 'image' | 'layout';
  baseModel: string; // Базовая модель (например, 'gpt-3.5-turbo', 'stable-diffusion-v1')
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number; // 0-100
  createdAt: Date;
  completedAt?: Date;
  trainedModelId?: string;
  metrics?: {
    loss?: number;
    accuracy?: number;
    samplesProcessed?: number;
  };
}

// Временное хранилище (в реальности - БД)
const datasets: TrainingDataset[] = [];
const jobs: FineTuningJob[] = [];

export class FineTuningService {
  /**
   * Создает датасет для обучения из проектов пользователя
   */
  static async createDataset(
    userId: string,
    projectIds: string[],
    contentType: 'text' | 'image' | 'layout' | 'color',
    brandId?: string
  ): Promise<TrainingDataset> {
    const samples: TrainingSample[] = [];

    // Собираем данные из проектов
    for (const projectId of projectIds) {
      const project = await ProjectsService.getById(projectId);
      if (!project || project.userId !== userId) {
        continue; // Пропускаем проекты, которые не принадлежат пользователю
      }

      if (contentType === 'text') {
        // Извлекаем текстовые примеры из блоков
        project.pages?.forEach((page) => {
          page.blocks?.forEach((block: any) => {
            if (block.content?.text) {
              samples.push({
                id: uuidv4(),
                input: `${project.niche} ${project.style} ${block.type}`,
                output: block.content.text,
                metadata: {
                  projectId,
                  pageId: page.id,
                  blockId: block.id,
                  blockType: block.type,
                },
              });
            }
          });
        });
      } else if (contentType === 'color') {
        // Извлекаем цветовые палитры
        if (project.brandAssets?.palette) {
          samples.push({
            id: uuidv4(),
            input: `${project.niche} ${project.style} color palette`,
            output: JSON.stringify(project.brandAssets.palette),
            metadata: {
              projectId,
              brandName: project.brandName,
            },
          });
        }
      } else if (contentType === 'layout') {
        // Извлекаем структуры макетов
        project.pages?.forEach((page) => {
          samples.push({
            id: uuidv4(),
            input: `${project.niche} ${project.style} page layout`,
            output: JSON.stringify({
              blocks: page.blocks?.map((b: any) => ({
                type: b.type,
                position: b.position,
                size: b.size,
              })),
            }),
            metadata: {
              projectId,
              pageId: page.id,
            },
          });
        });
      }
    }

    const dataset: TrainingDataset = {
      id: uuidv4(),
      userId,
      brandId,
      projectIds,
      contentType,
      samples,
      createdAt: new Date(),
      status: 'pending',
    };

    datasets.push(dataset);
    console.log(`Created dataset ${dataset.id} with ${samples.length} samples for user ${userId}`);

    return dataset;
  }

  /**
   * Запускает задачу fine-tuning
   */
  static async startFineTuningJob(
    datasetId: string,
    userId: string,
    modelType: 'text' | 'image' | 'layout',
    baseModel: string = 'gpt-3.5-turbo'
  ): Promise<FineTuningJob> {
    const dataset = datasets.find((d) => d.id === datasetId && d.userId === userId);
    if (!dataset) {
      throw new Error('Dataset not found');
    }

    if (dataset.samples.length < 10) {
      throw new Error('Dataset must contain at least 10 samples');
    }

    const job: FineTuningJob = {
      id: uuidv4(),
      datasetId,
      userId,
      modelType,
      baseModel,
      status: 'queued',
      progress: 0,
      createdAt: new Date(),
    };

    jobs.push(job);

    // Симуляция процесса обучения (в реальности - вызов API OpenAI или другого сервиса)
    this.simulateTraining(job);

    return job;
  }

  /**
   * Симулирует процесс обучения (в реальности - интеграция с OpenAI Fine-tuning API)
   */
  private static async simulateTraining(job: FineTuningJob) {
    job.status = 'running';
    const dataset = datasets.find((d) => d.id === job.datasetId);

    // Симуляция прогресса
    const interval = setInterval(() => {
      job.progress = Math.min(job.progress + 10, 100);

      if (job.progress >= 100) {
        clearInterval(interval);
        job.status = 'completed';
        job.completedAt = new Date();
        job.trainedModelId = `ft-${job.id}`;
        job.metrics = {
          loss: 0.15 + Math.random() * 0.1,
          accuracy: 0.85 + Math.random() * 0.1,
          samplesProcessed: dataset?.samples.length || 0,
        };

        // Обновляем датасет
        if (dataset) {
          dataset.status = 'completed';
          dataset.modelId = job.trainedModelId;
        }

        console.log(`Fine-tuning job ${job.id} completed`);
      }
    }, 1000);
  }

  /**
   * Получает статус задачи обучения
   */
  static getJobStatus(jobId: string, userId: string): FineTuningJob | null {
    const job = jobs.find((j) => j.id === jobId && j.userId === userId);
    return job || null;
  }

  /**
   * Получает все датасеты пользователя
   */
  static getUserDatasets(userId: string, brandId?: string): TrainingDataset[] {
    return datasets.filter(
      (d) => d.userId === userId && (!brandId || d.brandId === brandId)
    );
  }

  /**
   * Получает все задачи обучения пользователя
   */
  static getUserJobs(userId: string): FineTuningJob[] {
    return jobs.filter((j) => j.userId === userId);
  }

  /**
   * Использует обученную модель для генерации контента
   */
  static async generateWithFineTunedModel(
    modelId: string,
    prompt: string,
    userId: string
  ): Promise<string> {
    const job = jobs.find((j) => j.trainedModelId === modelId && j.userId === userId);
    if (!job || job.status !== 'completed') {
      throw new Error('Model not found or not ready');
    }

    // В реальности здесь был бы вызов API обученной модели
    // Для демо возвращаем улучшенный промпт
    return `[Fine-tuned model ${modelId}] Generated content for: ${prompt}`;
  }

  /**
   * Удаляет датасет и связанные модели
   */
  static async deleteDataset(datasetId: string, userId: string): Promise<boolean> {
    const index = datasets.findIndex((d) => d.id === datasetId && d.userId === userId);
    if (index === -1) {
      return false;
    }

    datasets.splice(index, 1);
    // Также удаляем связанные задачи
    const relatedJobs = jobs.filter((j) => j.datasetId === datasetId);
    relatedJobs.forEach((j) => {
      const jobIndex = jobs.indexOf(j);
      if (jobIndex !== -1) {
        jobs.splice(jobIndex, 1);
      }
    });

    return true;
  }
}

