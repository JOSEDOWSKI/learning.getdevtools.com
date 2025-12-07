import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getInfo() {
    return {
      name: 'Plataforma Educativa Nacional - API',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        health: '/health',
        auth: '/auth',
        users: '/users',
        courses: '/courses',
        submissions: '/submissions',
        certificates: '/certificates',
        access: '/access',
      },
      documentation: 'Ver README.md o API_ENDPOINTS.md para más información',
    };
  }

  @Get('health')
  healthCheck() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}

