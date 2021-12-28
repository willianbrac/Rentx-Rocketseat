import { inject, injectable } from "tsyringe";

import { ISpecificationRepository } from "@modules/cars/repositories/ISpecificationsRepository";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
    name: string;
    description: string;
}

@injectable()
class CreateSpecificationUseCase {
    constructor(
        @inject("SpecificationRepository")
        private specificationsRepository: ISpecificationRepository
    ) {}

    async execute({ name, description }: IRequest): Promise<void> {
        const specificationAlreadExists =
            await this.specificationsRepository.findByName(name);

        if (specificationAlreadExists) {
            throw new AppError("Specification already exists!");
        }

        await this.specificationsRepository.create({
            name,
            description,
        });
    }
}

export { CreateSpecificationUseCase };
