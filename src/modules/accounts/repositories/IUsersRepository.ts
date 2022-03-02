import { ICreateUserDTO } from "../dtos/ICreateUserDTO";
import { User } from "../infra/typeorm/entities/User";

export interface IUsersRepository {
    findById(id: string): Promise<User>;
    findByEmail(email: string): Promise<User>;
    create(data: ICreateUserDTO): Promise<User>;
}
