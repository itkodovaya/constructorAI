/**
 * Edge AI Service (Transformers.js integration)
 * Выполняет нейросетевые задачи прямо в браузере.
 */

import { pipeline } from '@xenova/transformers';

class EdgeAIService {
  private pipelines: Map<string, any> = new Map();

  /**
   * Загрузка модели (ленивая инициализация)
   */
  async getPipeline(task: any, model: string = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english') {
    const key = `${task}:${model}`;
    if (!this.pipelines.has(key)) {
      console.log(`[Edge AI] Loading model: ${model}...`);
      const pipe = await pipeline(task, model);
      this.pipelines.set(key, pipe);
    }
    return this.pipelines.get(key);
  }

  /**
   * Анализ настроения текста (Sentiment Analysis) - локально
   */
  async analyzeSentiment(text: string) {
    const pipe = await this.getPipeline('sentiment-analysis');
    const result = await pipe(text);
    return result[0];
  }

  /**
   * Генерация краткого описания (Summarization) - локально
   */
  async summarize(text: string) {
    const pipe = await this.getPipeline('summarization', 'Xenova/distilbart-cnn-6-6');
    const result = await pipe(text, { max_new_tokens: 50 });
    return result[0].summary_text;
  }

  /**
   * Обнаружение объектов на фото (Object Detection) - локально
   */
  async detectObjects(imageUrl: string) {
    const pipe = await this.getPipeline('object-detection', 'Xenova/detr-resnet-50');
    const result = await pipe(imageUrl);
    return result;
  }
}

export const edgeAI = new EdgeAIService();

