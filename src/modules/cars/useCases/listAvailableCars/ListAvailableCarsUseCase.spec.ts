import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let carsRepositoryInMemory: CarsRepositoryInMemory;
let listAvailableCarsUseCase: ListAvailableCarsUseCase;

describe("List Cars", () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        listAvailableCarsUseCase = new ListAvailableCarsUseCase(
            carsRepositoryInMemory
        );
    });

    it("shoul be able to list all available cars", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "RS3",
            description: "Branco",
            daily_rate: 150,
            license_plate: "ABCD-1234",
            fine_amount: 60,
            brand: "AUDI",
            category_id: "Category_id",
        });
        const cars = await listAvailableCarsUseCase.execute({});
        expect(cars).toEqual([car]);
    });

    it("shoul be able to list all available cars by brand", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "458 Italia",
            description: "Vermelha",
            daily_rate: 900,
            license_plate: "CUPI-8888",
            fine_amount: 1000,
            brand: "Ferrari",
            category_id: "Category_id",
        });

        const cars = await listAvailableCarsUseCase.execute({
            brand: "Ferrari",
        });
        expect(cars).toEqual([car]);
    });

    it("shoul be able to list all available cars by name", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "RS4",
            description: "Cinza",
            daily_rate: 300,
            license_plate: "ASDF-1234",
            fine_amount: 60,
            brand: "AUDI",
            category_id: "Category_id",
        });

        const cars = await listAvailableCarsUseCase.execute({
            name: "RS4",
        });
        expect(cars).toEqual([car]);
    });

    it("shoul be able to list all available cars by category", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Fusion 2.5",
            description: "2020",
            daily_rate: 400,
            license_plate: "JJJ-111",
            fine_amount: 70,
            brand: "Ford",
            category_id: "568329cd-2d97-498c-baa0-bbfeaf9cca7b",
        });

        const cars = await listAvailableCarsUseCase.execute({
            category_id: "568329cd-2d97-498c-baa0-bbfeaf9cca7b",
        });
        expect(cars).toEqual([car]);
    });
});
