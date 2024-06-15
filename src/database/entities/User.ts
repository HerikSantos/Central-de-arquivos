import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Upload } from "./Upload";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ default: 200000000 })
    availableUploadSpace: number;

    @OneToMany(() => Upload, (upload) => upload.user)
    uploads: Upload[];
}
