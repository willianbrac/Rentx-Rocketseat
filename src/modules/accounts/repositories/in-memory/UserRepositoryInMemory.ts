import { User } from "@modules/accounts/infra/typeorm/entities/User";

import { ICreateUserDTO, IUsersRepository } from "../IUsersRepository";

class UsersRepositoryInMemory implements IUsersRepository {
    users: User[] = [];

    async findById(id: string): Promise<User> {
        const user = this.users.find((user) => user.id === id);
        return user;
    }

    async findByEmail(email: string): Promise<User> {
        const user = this.users.find((user) => user.email === email);
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
        const user = new User();

        Object.assign(user, {
            name,
            password,
            email,
            driver_license,
            id,
            avatar,
        });

        this.users.push(user);
    }
}

export { UsersRepositoryInMemory };
