import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): { status: number; health: string; message: string } {
    return {
      status: 200,
      health: 'OK',
      message: 'server is up and running',
    };
  }
}
