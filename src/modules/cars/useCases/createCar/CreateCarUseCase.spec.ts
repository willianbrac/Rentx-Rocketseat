import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";

import { CreateCarUseCase } from "./CreateCarUseCase";

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create Car", () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
    });
    it("should be able to create a new car", async () => {
        const car = await createCarUseCase.execute({
            name: "Name car",
            description: "Description car",
            daily_rate: 150,
            license_plate: "ABD-1234",
            fine_amount: 30,
            brand: "Brand",
            category_id: "Category",
        });
        expect(car).toHaveProperty("id");
    });
    it("should not be able to create a car with exists license plate", async () => {
        await createCarUseCase.execute({
            name: "Car1",
            description: "Description car",
            daily_rate: 150,
            license_plate: "ABD-1234",
            fine_amount: 30,
            brand: "Brand",
            category_id: "Category",
        });
        await expect(
            createCarUseCase.execute({
                name: "Car2",
                description: "Description car",
                daily_rate: 150,
                license_plate: "ABD-1234",
                fine_amount: 30,
                brand: "Brand",
                category_id: "Category",
            })
        ).rejects.toEqual(new AppError("Car alread exists"));
    });
    it("should not be able to create a car with available true by default", async () => {
        const car = await createCarUseCase.execute({
            name: "Car available",
            description: "Description car",
            daily_rate: 150,
            license_plate: "ABCD-1234",
            fine_amount: 30,
            brand: "Brand",
            category_id: "Category",
        });
        expect(car.available).toBe(true);
    });
});
