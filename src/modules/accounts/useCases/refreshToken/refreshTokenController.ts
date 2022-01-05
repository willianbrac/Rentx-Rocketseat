import { Request, Response } from "express";
import { container } from "tsyringe";

import { RefreshTokenUseCase } from "./refreshTokenUseCase";

class RefreshTokenController {
    async handle(request: Request, response: Response): Promise<Response> {
        // o token pode ser recebido por 3 formas
        const token =
            request.body.token ||
            request.headers["x-access-token"] ||
            request.query.token;

        const refreshTokenUseCase = container.resolve(RefreshTokenUseCase);

        const refresh_token = await refreshTokenUseCase.execute(token);

        return response.json(refresh_token);
    }
}

export { RefreshTokenController };
