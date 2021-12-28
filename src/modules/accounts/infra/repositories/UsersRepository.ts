import { getRepository, Repository } from "typeorm";

import {
    IUsersRepository,
    ICreateUserDTO,
} from "@modules/accounts/repositories/IUsersRepository";

import { User } from "../typeorm/entities/User";

class UsersRepository implements IUsersRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = getRepository(User);
    }
    async findById(id: string): Promise<User> {
        const user = await this.repository.findOne({ id });
        return user;
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.repository.findOne({ email });
        return user;
    }

    async create({
        name,
        password,
        email,
        driver_license,
        id,
        avatar,
    }: ICreateUserDTO): Promise<void> {
        const User = this.repository.create({
            name,
            password,
            email,
            driver_license,
            id,
            avatar,
        });

        await this.repository.save(User);
    }
}

export { UsersRepository };
