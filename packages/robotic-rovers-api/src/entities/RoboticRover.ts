import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Relation,
  OneToMany,
} from 'typeorm';
import { Plateau } from './Plateau';
import { MoveInstruction } from './MoveInstruction';

@Entity()
export class RoboticRover {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  xInitialPosition: number;

  @Column()
  yInitialPosition: number;

  @Column()
  xCurrentPosition: number;

  @Column()
  yCurrentPosition: number;

  @Column()
  orientation: string;

  @ManyToOne(() => Plateau, (plateau) => plateau.roboticRovers)
  @JoinColumn()
  plateau: Relation<Plateau>;

  @OneToMany(() => MoveInstruction, (instruction) => instruction.roboticRover)
  moveInstructions: Relation<MoveInstruction[]>;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;
}
