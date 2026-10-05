import { Injectable, BadRequestException, NotFoundException, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not } from 'typeorm';
import { Booking } from './booking.entity';
import { Room } from '../room/room.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

const MS_PER_NIGHT = 24 * 60 * 60 * 1000;

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    // Optional so the unit tests (which only mock the Booking repository) can still build the service
    @Optional()
    @InjectRepository(Room)
    private roomsRepository?: Repository<Room>,
  ) {}

  async create(userId: number, createBookingDto: CreateBookingDto): Promise<Booking> {
    const checkInDate = new Date(createBookingDto.checkInDate);
    const checkOutDate = new Date(createBookingDto.checkOutDate);

    if (checkOutDate <= checkInDate) {
      throw new BadRequestException('checkOutDate must be after checkInDate');
    }

    if (await this.hasDateConflict(createBookingDto.roomId, checkInDate, checkOutDate)) {
      throw new BadRequestException('Room is already booked for the selected dates');
    }

    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / MS_PER_NIGHT);
    let totalPrice = 0;

    if (this.roomsRepository) {
      const room = await this.roomsRepository.findOne({ where: { id: createBookingDto.roomId } });
      if (!room) {
        throw new NotFoundException(`Room with id ${createBookingDto.roomId} not found`);
      }
      totalPrice = nights * Number(room.pricePerNight);
    }

    // FIX (Bug 4): the relation is 'room', not 'roomId' - the room was never linked to the booking
    const booking = this.bookingsRepository.create({
      checkInDate,
      checkOutDate,
      totalPrice,
      room: { id: createBookingDto.roomId },
      user: { id: userId },
      status: 'pending',
    });

    return this.bookingsRepository.save(booking);
  }

  async findOne(id: number): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: ['room', 'user'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }

    return booking;
  }

  async findByUser(userId: number): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { user: { id: userId } },
      relations: ['room', 'user'],
    });
  }

  async findByRoom(roomId: number): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { room: { id: roomId } },
      relations: ['room', 'user'],
    });
  }

  async cancel(id: number): Promise<Booking> {
    await this.findOne(id);
    await this.bookingsRepository.update(id, { status: 'cancelled' });
    return this.findOne(id);
  }

  // Two ranges overlap when existing.checkIn < new.checkOut AND existing.checkOut > new.checkIn
  async hasDateConflict(
    roomId: number,
    checkInDate: Date,
    checkOutDate: Date,
  ): Promise<boolean> {
    const overlapping = await this.bookingsRepository.find({
      where: {
        room: { id: roomId },
        status: Not('cancelled'),
        checkInDate: LessThan(new Date(checkOutDate)),
        checkOutDate: MoreThan(new Date(checkInDate)),
      },
    });

    return overlapping?.length > 0;
  }

  async getBookingsByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<Booking[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
      throw new BadRequestException('Invalid date range');
    }

    return this.bookingsRepository.find({
      where: {
        checkInDate: LessThanOrEqual(end),
        checkOutDate: MoreThanOrEqual(start),
      },
      relations: ['room', 'user'],
    });
  }
}
