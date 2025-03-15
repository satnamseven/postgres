import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "satnam",
  password: "password",
  database: "satnam_db",
  synchronize: false,
  logging: false,
  entities: ["entity/**/*.ts"],
  migrations: ["migration/**/*.ts"],
  subscribers: ["subscriber/**/*.ts"],
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
