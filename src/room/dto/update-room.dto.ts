import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

// All fields optional, same rules as CreateRoomDto
export class UpdateRoomDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  roomNumber?: string;

  @IsOptional()
  @IsIn(['single', 'double', 'suite'])
  type?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  pricePerNight?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  available?: boolean;
}
