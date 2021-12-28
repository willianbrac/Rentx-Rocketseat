import { ICreateUserDTO } from "../dtos/ICreateUserDTO";
import { User } from "../infra/typeorm/entities/User";

interface IUsersRepository {
    findById(id: string): Promise<User>;
    findByEmail(email: string): Promise<User>;
    create({
        name,
        password,
        email,
        driver_license,
        id,
        avatar,
    }: ICreateUserDTO): Promise<void>;
}

export { IUsersRepository, ICreateUserDTO };
