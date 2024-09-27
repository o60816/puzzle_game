import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('problems')
export class ProblemsEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255 })
  question: string;

  @Column({ length: 255, nullable: true })
  image: string;

  @Column({ length: 255 })
  answer: string;

  @Column()
  number: number;

  @Column({ length: 255, default: '答案不對喔，再好好想想吧' })
  error_message: string;

  @Column({ length: 255, nullable: true })
  hint: string;
}
