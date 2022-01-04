import dayjs from "dayjs";

import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserRepositoryInMemory";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/rentalsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./createRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let carsRepository: CarsRepositoryInMemory;
let usersRepository: UsersRepositoryInMemory;
let rentalsRepository: RentalsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;

describe("Create Rental", () => {
    const dayAdd24Hours = dayjs().add(1, "day").toDate();

    beforeEach(() => {
        rentalsRepository = new RentalsRepositoryInMemory();

        carsRepository = new CarsRepositoryInMemory();

        usersRepository = new UsersRepositoryInMemory();

        dayjsDateProvider = new DayjsDateProvider();

        createRentalUseCase = new CreateRentalUseCase(
            rentalsRepository,
            dayjsDateProvider,
            carsRepository
        );
    });

    it("should be able to create a new rental", async () => {
        const user = await usersRepository.create({
            name: "Bruno",
            email: "Bruno@email.com",
            password: "1234",
            driver_license: "99888777",
        });

        const car = await carsRepository.create({
            name: "Jetta",
            description: "TSI 2.0 branco",
            daily_rate: 200,
            license_plate: "ABC-1234",
            fine_amount: 60,
            brand: "Volkswagen",
            category_id: "Category",
        });

        const rental = await createRentalUseCase.execute({
            user_id: user.id,
            car_id: car.id,
            expected_return_date: dayAdd24Hours,
        });

        expect(rental).toHaveProperty("id");
        expect(rental).toHaveProperty("start_date");
    });

    it("should not be able to create a new rental if there is another open to the same user", async () => {
        const user = await usersRepository.create({
            name: "Teste",
            email: "teste@email.com",
            password: "1234",
            driver_license: "99888777",
        });

        const car1 = await carsRepository.create({
            name: "Polo",
            description: "200TSI preto",
            daily_rate: 200,
            license_plate: "CBA-1234",
            fine_amount: 60,
            brand: "Volkswagen",
            category_id: "Category",
        });

        const car2 = await carsRepository.create({
            name: "Golf",
            description: "R vermelho",
            daily_rate: 250,
            license_plate: "CBA-1234",
            fine_amount: 80,
            brand: "Volkswagen",
            category_id: "Category",
        });

        await createRentalUseCase.execute({
            user_id: user.id,
            car_id: car1.id,
            expected_return_date: dayAdd24Hours,
        });

        await expect(
            createRentalUseCase.execute({
                user_id: user.id,
                car_id: car2.id,
                expected_return_date: dayAdd24Hours,
            })
        ).rejects.toEqual(
            new AppError("There's a rental in progress for user!")
        );
    });

    it("should not be able to create a new rental if there is another open to the same car", async () => {
        const user1 = await usersRepository.create({
            name: "user1",
            email: "user1@email.com",
            password: "1234",
            driver_license: "99888777",
        });

        const user2 = await usersRepository.create({
            name: "user2",
            email: "user2@email.com",
            password: "1234",
            driver_license: "66555444",
        });

        const car = await carsRepository.create({
            name: "X1",
            description: "2.0 16v Turbo Activeflex",
            daily_rate: 400,
            license_plate: "xyz-1234",
            fine_amount: 80,
            brand: "BMW",
            category_id: "Category",
        });

        await createRentalUseCase.execute({
            user_id: user1.id,
            car_id: car.id,
            expected_return_date: dayAdd24Hours,
        });

        await expect(
            createRentalUseCase.execute({
                user_id: user2.id,
                car_id: car.id,
                expected_return_date: dayAdd24Hours,
            })
        ).rejects.toEqual(new AppError("Car is unavailable"));
    });

    it("should not be able to create a new rental with invalid return time", async () => {
        const user = await usersRepository.create({
            name: "user3",
            email: "user3@email.com",
            password: "1234",
            driver_license: "44333222",
        });

        const car = await carsRepository.create({
            name: "Cerato",
            description: "SX 2.0 Azul",
            daily_rate: 350,
            license_plate: "rst-1234",
            fine_amount: 65,
            brand: "KIA",
            category_id: "Category",
        });

        await expect(
            createRentalUseCase.execute({
                user_id: user.id,
                car_id: car.id,
                expected_return_date: dayjs().toDate(),
            })
        ).rejects.toEqual(new AppError("Invalid return time!"));
    });
});
