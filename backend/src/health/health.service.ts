import { Injectable } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  HealthCheckResult,
  MongooseHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private mongoose: MongooseHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    return this.health.check([
      // Database health
      () => this.mongoose.pingCheck('mongodb'),
      
      // Memory health - uses 512MB as threshold
      () => this.memory.checkHeap('memory_heap', 512 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 768 * 1024 * 1024),
      
      // Disk storage health - uses 50GB as threshold
      () => this.disk.checkStorage('storage', { 
        path: '/', 
        thresholdPercent: 0.9 // 90% usage threshold
      }),
    ]);
  }

  @HealthCheck()
  async readiness(): Promise<HealthCheckResult> {
    return this.health.check([
      // Only check critical dependencies for readiness
      () => this.mongoose.pingCheck('mongodb'),
    ]);
  }

  @HealthCheck()
  async liveness(): Promise<HealthCheckResult> {
    return this.health.check([
      // Basic health checks for liveness
      () => this.memory.checkHeap('memory_heap', 1024 * 1024 * 1024), // 1GB
    ]);
  }
}