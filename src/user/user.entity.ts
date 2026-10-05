import { Entity, CreateDateColumn, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from '../booking/booking.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone: string;

  // FIX: 'timestamp' is not a valid SQLite column type and prevented the app from starting
  @CreateDateColumn()
  createdAt: Date;

  // Cascade delete is configured on the owning side: Booking.user has onDelete: 'CASCADE'
  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}
