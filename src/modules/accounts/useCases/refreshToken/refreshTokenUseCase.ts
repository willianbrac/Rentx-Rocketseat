import { verify, sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

// sub e email vem dentro do payload
interface IPayload {
    sub: string;
    email: string;
}
interface ITokenResponse {
    token: string;
    refresh_token: string;
}

@injectable()
class RefreshTokenUseCase {
    constructor(
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider
    ) {}

    async execute(token: string): Promise<ITokenResponse> {
        // Receber o token e verificar se é válido
        const { email, sub } = verify(
            token,
            auth.secret_refresh_token
        ) as IPayload;

        const user_id = sub;

        // Faz uma verificação do token na base de dados
        const userToken =
            await this.usersTokensRepository.findByUserIdAndRefreshToken(
                user_id,
                token
            );

        // valida o resultado do find
        if (!userToken) {
            throw new AppError("Refresh Token does not exists!");
        }

        // remove o token atual para não sobrecarregar a base de dados
        await this.usersTokensRepository.deleteById(userToken.id);

        // criação de um novo refresh token
        const refresh_token = sign({ email }, auth.secret_refresh_token, {
            subject: sub,
            expiresIn: auth.expires_in_refresh_token,
        });

        // cria uma nova data de expiração para o novo token
        const expires_date = this.dateProvider.addDays(
            auth.expires_refresh_token_days
        );

        // salva o novo token no repositório passando as informações geradas
        await this.usersTokensRepository.create({
            expires_date,
            refresh_token,
            user_id,
        });

        const newToken = sign({}, auth.secret_token, {
            subject: user_id,
            expiresIn: auth.expires_in_token,
        });

        // retorna o refresh token
        return {
            refresh_token,
            token: newToken,
        };
    }
}

export { RefreshTokenUseCase };
