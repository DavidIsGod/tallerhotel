import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  roomNumber: string;

  @IsIn(['single', 'double', 'suite'])
  type: string;

  @IsNumber()
  @Min(0.01)
  pricePerNight: number;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  available?: boolean;
}
