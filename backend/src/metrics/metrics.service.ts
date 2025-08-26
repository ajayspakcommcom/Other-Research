import { Injectable } from '@nestjs/common';
import { register, collectDefaultMetrics, Counter, Histogram, Gauge } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly httpRequestTotal: Counter<string>;
  private readonly httpRequestDuration: Histogram<string>;
  private readonly activeConnections: Gauge<string>;
  private readonly dbConnectionPool: Gauge<string>;

  constructor() {
    // Collect default metrics
    collectDefaultMetrics({ register });

    // HTTP request counter
    this.httpRequestTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status'],
      registers: [register],
    });

    // HTTP request duration
    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status'],
      buckets: [0.1, 0.5, 1, 2, 5, 10],
      registers: [register],
    });

    // Active connections
    this.activeConnections = new Gauge({
      name: 'active_connections',
      help: 'Number of active connections',
      registers: [register],
    });

    // Database connection pool
    this.dbConnectionPool = new Gauge({
      name: 'db_connection_pool_size',
      help: 'Database connection pool size',
      labelNames: ['state'],
      registers: [register],
    });
  }

  incrementHttpRequests(method: string, route: string, status: number): void {
    this.httpRequestTotal.inc({ method, route, status: status.toString() });
  }

  recordHttpRequestDuration(
    method: string,
    route: string,
    status: number,
    duration: number,
  ): void {
    this.httpRequestDuration
      .labels({ method, route, status: status.toString() })
      .observe(duration);
  }

  setActiveConnections(count: number): void {
    this.activeConnections.set(count);
  }

  setDbConnectionPoolSize(state: string, count: number): void {
    this.dbConnectionPool.set({ state }, count);
  }

  async getMetrics(): Promise<string> {
    return register.metrics();
  }

  getRegister() {
    return register;
  }
}