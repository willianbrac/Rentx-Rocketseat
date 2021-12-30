import { Request, Response } from "express";
import { container, injectable } from "tsyringe";

import { ListRentalsByUserUseCase } from "./ListRentalsByUserUseCase";

@injectable()
class ListRentalsByUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.user;

        const listRentalsByUserUseCase = container.resolve(
            ListRentalsByUserUseCase
        );

        const rentals = await listRentalsByUserUseCase.execute(id);

        return response.json(rentals);
    }
}

export { ListRentalsByUserController };
