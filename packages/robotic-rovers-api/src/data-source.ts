import { DataSource } from 'typeorm';
import { config } from './config';
import { Plateau } from './entities/Plateau';
import { RoboticRover } from './entities/RoboticRover';
import { MoveInstruction } from './entities/MoveInstruction';

const { main } = config.get('database');

export const mainDataSource = new DataSource({
  type: 'mysql',
  connectorPackage: 'mysql2',
  host: main.host,
  port: main.port,
  username: main.user,
  password: main.password,
  database: main.database,
  synchronize: true,
  logging: true,
  entities: [Plateau, RoboticRover, MoveInstruction],
});
