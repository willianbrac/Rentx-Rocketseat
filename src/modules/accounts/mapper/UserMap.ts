import { instanceToInstance } from "class-transformer";

import { IUsersResponseDTO } from "../dtos/IUsersResponseDTO";
import { User } from "../infra/typeorm/entities/User";

export class UserMap {
    static toDTO({
        id,
        name,
        email,
        avatar,
        driver_license,
        avatar_url,
    }: User): IUsersResponseDTO {
        const user = instanceToInstance({
            id,
            name,
            email,
            avatar,
            driver_license,
            avatar_url,
        });
        return user;
    }
}
