import { Injectable, OnModuleInit, OnModuleDestroy, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Conectado a la base de datos');
    } catch (error) {
      this.logger.error('Error conectando a la base de datos', error);
      throw new InternalServerErrorException('Error de conexión a base de datos');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Desconectado de la base de datos');
  }
}
