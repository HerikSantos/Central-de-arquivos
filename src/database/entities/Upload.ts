import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "./User";

@Entity()
export class Upload {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    file: string;

    @Column()
    size: number;

    @ManyToOne(() => User, (user) => user.uploads)
    user: User;
}
