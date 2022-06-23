import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabase(
  "persistencia.db",
  "1.0.0",
  "Mecanica Database",
  10000000
);

export const createTables = () => {
  createTableVehiculos();
  createTableClientes();
  createTableTratamientos();
};

const createTableVehiculos = () => {
  db.transaction((txn) => {
    txn.executeSql(
      `
create table if not exists Vehiculos (
  Matricula varchar(7) primary key,
  Marca varchar(20) not null,
  Color varchar(20) not null,
  serial varchar(20) not null unique
);`,
      [],
      (_, res) => {
        console.log("table vehiculos created");
      },
      (_, error) => {
        console.log(`error while creating tables`);
        console.log(error);
      }
    );
  });
};

const createTableClientes = () => {
  db.transaction((txn) => {
    txn.executeSql(
      `
create table if not exists Clientes (
  Nombre varchar(20) not null,
  Apellido varchar(20) not null,
  CI varchar(8) not null,
  Vehiculo integer references Vehiculos(Id),
  primary key(CI)
);`,
      [],
      (_, res) => {
        console.log("table clientes created");
      },
      (_, error) => {
        console.log(`error while creating tables`);
        console.log(error);
      }
    );
  });
};

const createTableTratamientos = () => {
  db.transaction((txn) => {
    txn.executeSql(
      `
create table if not exists Tratamientos (
  Id integer primary key,
  Titulo varchar(30) not null,
  Cliente integer references Clientes(CI),
  FechaInicio datetime check(FechaInicio <= date()) default(date()),
  FechaFin datetime check(FechaFin <= date()),
  Costo integer,
  check(FechaInicio < FechaFin)
);`,
      [],
      (_, res) => {
        console.log("table clientes created");
      },
      (_, error) => {
        console.log(`error while creating tables`);
        console.log(error);
      }
    );
  });
};
