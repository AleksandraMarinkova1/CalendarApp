import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
   (this as any).$on('beforeExit', async () => {
  await app.close();
});
  }
}
