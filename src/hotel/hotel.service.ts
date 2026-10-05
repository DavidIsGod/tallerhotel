import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Hotel } from './hotel.entity';
import { CreateHotelDto } from './dto/create-hotel.dto';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private hotelsRepository: Repository<Hotel>,
  ) {}

  async create(createHotelDto: CreateHotelDto): Promise<Hotel> {
    const hotel = this.hotelsRepository.create(createHotelDto);
    return this.hotelsRepository.save(hotel);
  }

  async findAll(): Promise<Hotel[]> {
    return this.hotelsRepository.find({ relations: ['rooms'] });
  }

  async findOne(id: number): Promise<Hotel> {
    const hotel = await this.hotelsRepository.findOne({
      where: { id },
      relations: ['rooms'],
    });

    if (!hotel) {
      throw new NotFoundException(`Hotel with id ${id} not found`);
    }

    return hotel;
  }

  async searchByLocation(location: string): Promise<Hotel[]> {
    return this.hotelsRepository.find({
      where: { location: Like(`%${location ?? ''}%`) },
      relations: ['rooms'],
    });
  }

  async getAvailableHotels(): Promise<Hotel[]> {
    const hotels = await this.hotelsRepository.find({ relations: ['rooms'] });
    return hotels.filter((hotel) => hotel.rooms?.some((room) => room.available));
  }

  async update(id: number, updateData: Partial<CreateHotelDto>): Promise<Hotel> {
    await this.findOne(id);
    await this.hotelsRepository.update(id, updateData);
    return this.findOne(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.hotelsRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Hotel with id ${id} not found`);
    }

    return true;
  }
}
