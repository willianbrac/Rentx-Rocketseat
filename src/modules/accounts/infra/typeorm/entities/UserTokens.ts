import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { User } from "./User";

@Entity("users_tokens")
export class UserTokens {
    @PrimaryColumn()
    id?: string;

    @Column()
    refresh_token: string;

    @Column()
    user_id: string;

    @Column()
    expires_date: Date;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user: User;

    constructor() {
        if (!this.id) {
            this.id = uuidV4();
        }
    }
}
