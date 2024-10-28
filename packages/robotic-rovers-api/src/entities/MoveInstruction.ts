import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Relation } from 'typeorm';
import { RoboticRover } from './RoboticRover';

@Entity()
export class MoveInstruction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: 'L' | 'R' | 'M';

  @Column()
  xNextPosition: number;

  @Column()
  yNextPosition: number;

  @Column()
  nextOrientation: string;

  @ManyToOne(() => RoboticRover, (rover) => rover.moveInstructions)
  @JoinColumn()
  roboticRover: Relation<RoboticRover>;
}
