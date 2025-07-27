import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.event.findMany();
  }

  async create(title: string, startDate: string, endDate: string) {
    return this.prisma.event.create({
      data: {
        title,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });
  }

  async delete(id: number) {
    await this.prisma.event.delete({ where: { id } });
    return { message: 'Event deleted successfully' };
  }

  async update(
    id: number,
    data: { title?: string; startDate?: string; endDate?: string }
  ) {
    const existingEvent = await this.prisma.event.findUnique({ where: { id } });
    if (!existingEvent) {
      console.log(error);
    }

    const updateData: { title?: string; startDate?: Date; endDate?: Date } = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.startDate !== undefined)
      updateData.startDate = new Date(data.startDate);
    if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate);

    return this.prisma.event.update({
      where: { id },
      data: updateData,
    });
  }
}
