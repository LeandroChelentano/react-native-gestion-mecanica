create table Vehiculos (
  Id integer primary key,
  Matricula varchar(7) unique,
  Marca varchar(20) not null,
  Color varchar(20) not null,
  serial varchar(20) not null unique
);

create table Clientes (
  Id integer primary key,
  Nombre varchar(20) not null,
  Apellido varchar(20) not null,
  CI varchar(8) unique,
  Vehiculo integer references Vehiculos(Id),
);

create table Insumos (
  Id integer primary key,
  Nombre varchar(30) unique
);

create table Repuestos (
  Id integer primary key,
  Nombre varchar(30) unique
);

create table Tratamientos (
  Id integer primary key,
  Titulo varchar(30) not null,
  Cliente integer references Clientes(Id),
  FechaInicio datetime default(date()),
  FechaFin datetime check(FechaFin <= date()),
  Costo integer,
  check(FechaInicio < FechaFin)
);

create table TratamientosInsumos (
  Tratamiento integer references Tratamientos(Id),
  Insumo integer references Insumos(Id),
  Cantidad integer check(Cantidad > 0),
  primary key (Tratamiento, Insumo)
);

create table TratamientosRepuestos (
  Tratamiento integer references Tratamientos(Id),
  Repuesto integer references Repuestos(Nombre),
  Cantidad integer check(Cantidad > 0),
  primary key (Tratamiento, Repuesto)
);