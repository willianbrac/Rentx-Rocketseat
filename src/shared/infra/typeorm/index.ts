import { Connection, createConnection, getConnectionOptions } from "typeorm";

export default async (host = "database"): Promise<Connection> => {
    const defautOptions = await getConnectionOptions();
    return createConnection(
        Object.assign(defautOptions, {
            host: process.env.NODE_ENV === "test" ? "localhost" : host,
            database:
                process.env.NODE_ENV === "test"
                    ? "rentx_test"
                    : defautOptions.database,
        })
    );
};
