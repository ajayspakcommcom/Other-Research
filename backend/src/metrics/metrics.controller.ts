import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MetricsService } from './metrics.service';

@ApiTags('metrics')
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  @Header('Content-Type', 'text/plain')
  @ApiOperation({ summary: 'Get Prometheus metrics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Prometheus metrics in text format',
    schema: {
      type: 'string',
      example: '# HELP nodejs_version_info Node.js version info\n# TYPE nodejs_version_info gauge\nnodejs_version_info{major="18",minor="17",patch="0"} 1'
    }
  })
  async getMetrics(): Promise<string> {
    return this.metricsService.getMetrics();
  }
}