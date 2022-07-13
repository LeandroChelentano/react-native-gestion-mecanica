import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabase(
  "mec.db",
  "1.0.0",
  "Mecanica Database",
  10000000
);

export const createTables = () => {
  // drop();
  createTableVehiculos();
  createTableClientes();
  createTableTratamientos();
  createTableInsumos();
  createTableRepuestos();
  createTableTraramientoRepuesto();
  createTableTratamientoInsumo();
};

const createTableVehiculos = () => {
  db.transaction((txn) => {
    txn.executeSql(
      `
create table if not exists Vehiculos (
  Id int primary key,
  Matricula varchar(7) unique,
  Marca varchar(20) not null,
  Color varchar(20) not null,
  serial varchar(20) not null unique
);`,
      [],
      (_, res) => {
        // console.log("table vehiculos created");
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
  Id integer primary key,
  Nombre varchar(20) not null,
  Apellido varchar(20) not null,
  CI varchar(8) unique,
  Vehiculo integer references Vehiculos(Id)
);`,
      [],
      (_, res) => {
        // console.log("table clientes created");
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
  Cliente integer references Clientes(Id),
  FechaInicio datetime default(date()),
  FechaFin datetime check(FechaFin <= date()),
  Costo integer,
  check(FechaInicio <= FechaFin)
);`,
      [],
      (_, res) => {
        // console.log("table clientes created");
      },
      (_, error) => {
        console.log(`error while creating tables`);
        console.log(error);
      }
    );
  });
};

const createTableInsumos = () => {
  db.transaction((txn) => {
    txn.executeSql(
      `
create table if not exists Insumos (
  Id int primary key,
  Nombre varchar(30) unique
);`,
      //       `
      // create table if not exists Insumos (
      //   Nombre varchar(30) primary key
      // );`,
      [],
      (_, res) => {
        // console.log("table clientes created");
      },
      (_, error) => {
        console.log(`error while creating tables`);
        console.log(error);
      }
    );
  });
};

const createTableRepuestos = () => {
  db.transaction((txn) => {
    txn.executeSql(
      `
create table if not exists Repuestos (
  Id int primary key,
  Nombre varchar(30) unique
);`,
      [],
      (_, res) => {
        // console.log("table clientes created");
      },
      (_, error) => {
        console.log(`error while creating tables`);
        console.log(error);
      }
    );
  });
};

const createTableTratamientoInsumo = () => {
  db.transaction((txn) => {
    txn.executeSql(
      `
create table if not exists TratamientosInsumos (
  Tratamiento integer references Tratamientos(Id),
  Insumo integer references Insumos(Nombre),
  Cantidad integer,
  primary key (Tratamiento, Insumo, Cantidad)
);`,
      [],
      (_, res) => {
        // console.log("table clientes created");
      },
      (_, error) => {
        console.log(`error while creating tables`);
        console.log(error);
      }
    );
  });
};

const createTableTraramientoRepuesto = () => {
  db.transaction((txn) => {
    txn.executeSql(
      `
create table if not exists TratamientosRepuestos (
  Tratamiento integer references Tratamientos(Id),
  Repuesto integer references Repuestos(Nombre),
  Cantidad integer,
  primary key (Tratamiento, Repuesto, Cantidad)
);`,
      [],
      (_, res) => {
        // console.log("table clientes created");
      },
      (_, error) => {
        console.log(`error while creating tables`);
        console.log(error);
      }
    );
  });
};

//#region aux
const drop = () => {
  db.transaction((txn) => {
    txn.executeSql(
      `drop table TratamientosInsumos;`,
      [],
      (_, res) => {
        // console.log("table clientes created");
      },
      (_, error) => {
        console.log(`error while dropping tables`);
        console.log(error);
      }
    );
  });
};

//#endregion
