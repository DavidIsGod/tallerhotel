import { Controller, Post, Get, Body, Param, Delete, Query, Request } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './booking.entity';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  // TODO: Add JWT guard to protect this endpoint
  async createBooking(
    @Request() req: any,
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<Booking> {
    // In a real scenario, userId would come from JWT token in req.user
    const userId = req.user?.id || 1; // Default to 1 for testing
    return this.bookingService.create(userId, createBookingDto);
  }

  // GET /bookings?startDate=2025-06-01&endDate=2025-06-30
  @Get()
  async getBookingsByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Booking[]> {
    return this.bookingService.getBookingsByDateRange(new Date(startDate), new Date(endDate));
  }

  @Get(':id')
  async getBooking(@Param('id') id: string): Promise<Booking> {
    return this.bookingService.findOne(parseInt(id));
  }

  @Get('user/:userId')
  async getUserBookings(@Param('userId') userId: string): Promise<Booking[]> {
    return this.bookingService.findByUser(parseInt(userId));
  }

  @Get('room/:roomId')
  async getRoomBookings(@Param('roomId') roomId: string): Promise<Booking[]> {
    return this.bookingService.findByRoom(parseInt(roomId));
  }

  // Cancels (soft delete): the booking is kept with status 'cancelled'
  @Delete(':id')
  async cancelBooking(@Param('id') id: string): Promise<Booking> {
    return this.bookingService.cancel(parseInt(id));
  }
}
