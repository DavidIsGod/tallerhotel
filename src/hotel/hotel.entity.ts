import { Entity, CreateDateColumn, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Room } from '../room/room.entity';

@Entity()
export class Hotel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column('decimal', { precision: 5, scale: 2 })
  rating: number;

  @Column({ nullable: true })
  description: string;

  // FIX: 'timestamp' is not a valid SQLite column type and prevented the app from starting
  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Room, (room) => room.hotel)
  rooms: Room[];
}
