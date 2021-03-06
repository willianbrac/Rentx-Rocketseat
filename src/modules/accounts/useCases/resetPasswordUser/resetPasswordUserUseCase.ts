import { hash } from "bcrypt";
import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
    token: string;
    password: string;
}

@injectable()
export class ResetPasswordUserUseCase {
    constructor(
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {}
    async execute({ token, password }: IRequest): Promise<void> {
        // verifica se o user existe dentro do users token
        const userToken = await this.usersTokensRepository.findByRefreshToken(
            token
        );

        // se o usertoken não existir uma exceção será lançada
        if (!userToken) throw new AppError("Token invalid!");

        // verfica se o token esta expirado
        if (
            this.dateProvider.compareIfBefore(
                userToken.expires_date,
                this.dateProvider.dateNow()
            )
        ) {
            throw new AppError("Token expired!");
        }

        // verifica se o usuario existe
        const user = await this.usersRepository.findById(userToken.user_id);

        // criptografa a nova senha
        user.password = await hash(password, 8);

        // Atualiza o token
        await this.usersRepository.create(user);

        // Remove o token antigo
        await this.usersTokensRepository.deleteById(userToken.id);
    }
}
