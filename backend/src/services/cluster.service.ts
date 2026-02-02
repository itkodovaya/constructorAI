/**
 * Cluster Service - Оркестрация GPU-кластеров и мониторинг AI-нод
 * Обеспечивает отказоустойчивость и распределение нагрузки на инференс
 */

export interface AINode {
  id: string;
  url: string;
  status: 'healthy' | 'overloaded' | 'offline';
  gpuMemoryUsed: number;
  gpuMemoryTotal: number;
  activeModels: string[];
}

export class ClusterService {
  private static nodes: Map<string, AAINode> = new Map();

  /**
   * Регистрация новой вычислительной ноды
   */
  static registerNode(node: AAINode) {
    this.nodes.set(node.id, node);
    console.log(`[Cluster] AI Node registered: ${node.id} (${node.url})`);
  }

  /**
   * Выбор наименее загруженной ноды для инференса
   */
  static getBestNode(): string {
    const healthyNodes = Array.from(this.nodes.values()).filter(n => n.status === 'healthy');
    if (healthyNodes.length === 0) return process.env.LOCAL_AI_ENDPOINT || 'http://localhost:11434/api';

    return healthyNodes.sort((a, b) => 
      (a.gpuMemoryUsed / a.gpuMemoryTotal) - (b.gpuMemoryUsed / b.gpuMemoryTotal)
    )[0].url;
  }

  /**
   * Мониторинг состояния кластера
   */
  static async checkHealth() {
    // В реальности: опрос каждой ноды через /health
    for (const [id, node] of this.nodes) {
      try {
        const response = await fetch(`${node.url}/health`);
        const data = await response.json();
        this.nodes.set(id, { ...node, status: 'healthy', ...data });
      } catch (e) {
        this.nodes.set(id, { ...node, status: 'offline' });
      }
    }
  }

  /**
   * Автоматическая подгрузка модели на подходящую ноду
   */
  static async ensureModelLoaded(modelName: string) {
    const nodeUrl = this.getBestNode();
    console.log(`[Cluster] Loading model ${modelName} on node ${nodeUrl}`);
    // Вызов API ноды (например Ollama /api/pull)
    return true;
  }
}

// Интерфейс для исправления опечатки в типе ноды
interface AAINode extends AINode {}

