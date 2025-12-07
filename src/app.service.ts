import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Plataforma Educativa Nacional - API';
  }
}

