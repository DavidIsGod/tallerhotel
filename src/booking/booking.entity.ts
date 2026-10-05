import { Entity, CreateDateColumn, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Room } from '../room/room.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  checkInDate: Date;

  @Column()
  checkOutDate: Date;

  @Column({ default: 'pending' })
  status: string; // 'pending', 'confirmed', 'cancelled'

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  // FIX: 'timestamp' is not a valid SQLite column type and prevented the app from starting
  @CreateDateColumn()
  createdAt: Date;

  // FIX (Bug 5): when a room is deleted, its bookings are deleted too
  @ManyToOne(() => Room, (room) => room.bookings, { onDelete: 'CASCADE' })
  room: Room;

  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE' })
  user: User;
}
