/**
 * Утилиты для метрик и мониторинга
 */

interface Metric {
  name: string;
  value: number;
  timestamp: Date;
  tags?: Record<string, string>;
}

class MetricsCollector {
  private metrics: Metric[] = [];
  private maxMetrics = 1000;

  record(name: string, value: number, tags?: Record<string, string>) {
    const metric: Metric = {
      name,
      value,
      timestamp: new Date(),
      tags
    };

    this.metrics.push(metric);

    // Ограничиваем размер массива
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }
  }

  increment(name: string, tags?: Record<string, string>) {
    this.record(name, 1, tags);
  }

  getMetrics(name?: string): Metric[] {
    if (name) {
      return this.metrics.filter(m => m.name === name);
    }
    return [...this.metrics];
  }

  getStats(name: string): {
    count: number;
    sum: number;
    avg: number;
    min: number;
    max: number;
  } | null {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return null;

    const values = metrics.map(m => m.value);
    return {
      count: metrics.length,
      sum: values.reduce((a, b) => a + b, 0),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values)
    };
  }

  clear() {
    this.metrics = [];
  }
}

export const metrics = new MetricsCollector();

// Middleware для автоматического сбора метрик
export function metricsMiddleware(req: any, res: any, next: any) {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    metrics.record('http_request_duration', duration, {
      method: req.method,
      path: req.path,
      status: res.statusCode.toString()
    });

    metrics.increment('http_requests_total', {
      method: req.method,
      path: req.path,
      status: res.statusCode.toString()
    });
  });

  next();
}

