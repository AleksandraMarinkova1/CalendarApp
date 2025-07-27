import { Controller, Get, Post, Delete, Body, Param,Put } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async getAll() {
    return this.eventsService.findAll();
  }

  @Post('add')
  async addEvent(@Body() body: { title: string; startDate: string; endDate: string }) {
    return this.eventsService.create(body.title, body.startDate, body.endDate);
  }

  @Delete(':id')
  async deleteEvent(@Param('id') id: string) {
    return this.eventsService.delete(Number(id));
  }

  @Put(':id')
  async updateEvent(
    @Param('id') id: string,
    @Body() body: { title?: string; startDate?: string; endDate?: string },
  ) {
    return this.eventsService.update(Number(id), body);
  }
}
