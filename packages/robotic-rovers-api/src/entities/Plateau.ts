import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, OneToMany, Relation } from 'typeorm';
import { RoboticRover } from './RoboticRover';

@Entity()
export class Plateau {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  xWidth: number;

  @Column()
  yHeight: number;

  @OneToMany(() => RoboticRover, (roboticRover) => roboticRover.plateau)
  roboticRovers: Relation<RoboticRover[]>;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;
}
