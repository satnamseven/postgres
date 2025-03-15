import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  studentId: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

}