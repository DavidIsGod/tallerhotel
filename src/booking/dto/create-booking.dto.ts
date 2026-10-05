import { Type } from 'class-transformer';
import { IsDate, IsInt, IsPositive } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  @IsPositive()
  roomId: number;

  @Type(() => Date)
  @IsDate()
  checkInDate: Date;

  // checkOutDate > checkInDate is enforced in BookingService.create
  @Type(() => Date)
  @IsDate()
  checkOutDate: Date;
}
