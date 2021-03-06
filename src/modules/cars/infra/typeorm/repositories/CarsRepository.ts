import { getRepository, Repository } from "typeorm";

import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";

import { Car } from "../entities/Car";

export class CarsRepository implements ICarsRepository {
    private repository: Repository<Car>;
    constructor() {
        this.repository = getRepository(Car);
    }
    async create({
        name,
        description,
        daily_rate,
        license_plate,
        fine_amount,
        brand,
        category_id,
        specifications,
        id,
    }: ICreateCarDTO): Promise<Car> {
        const car = this.repository.create({
            name,
            description,
            daily_rate,
            license_plate,
            fine_amount,
            brand,
            category_id,
            specifications,
            id,
        });
        await this.repository.save(car);
        return car;
    }
    async findByLicensePlate(license_plate: string): Promise<Car> {
        const car = await this.repository.findOne({
            license_plate,
        });
        return car;
    }
    async findAvailable(
        brand?: string,
        category_id?: string,
        name?: string
    ): Promise<Car[]> {
        const carsQuery = await this.repository
            .createQueryBuilder("car")
            .where("available = :available", { available: true });

        if (brand) carsQuery.andWhere("car.brand = :brand", { brand });

        if (name) carsQuery.andWhere("car.name = :name", { name });

        if (category_id)
            carsQuery.andWhere("car.category_id = :name", { category_id });

        const cars = await carsQuery.getMany();
        return cars;
    }
    async findById(id: string): Promise<Car> {
        const car = await this.repository.findOne(id);
        return car;
    }
    async updateAvailable(
        car_id: string,
        availability: boolean
    ): Promise<void> {
        await this.repository
            .createQueryBuilder()
            .update()
            .set({
                available: availability,
            })
            .where("id = :car_id")
            .setParameters({ car_id })
            .execute();
    }
}
