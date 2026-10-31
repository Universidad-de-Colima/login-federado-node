import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  nombre: string;

  @ApiProperty()
  @Column({ unique: true })
  correo: string;

  @ApiProperty()
  @CreateDateColumn()
  creado: Date;
}
