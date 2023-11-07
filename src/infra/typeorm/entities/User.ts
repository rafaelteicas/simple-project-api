import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { type UserAccount } from '../../../domain/userTypes'

@Entity()
export class User implements UserAccount {
  @PrimaryGeneratedColumn()
    id: number

  @Column()
    email: string

  @Column()
    password: string

  @Column()
    username: string
}
