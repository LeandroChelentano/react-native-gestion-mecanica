create table Vehiculos (
  Id integer primary key,
  Matricula text unique check(Matricula like '[A-Z][A-Z][A-Z][0-9][0-9][0-9]' or Matricula like '[A-Z][A-Z][A-Z][0-9][0-9][0-9][0-9]'),
  Marca text not null,
  Color text not null,
  serial text not null
);

create table Clientes (
  Nombre text not null,
  Apellido text not null,
  CI text not null,
  Vehiculo integer references Vehiculos(Id),
  primary key(CI)
);

create table Insumos (
  Nombre text primary key
);

create table Repuestos (
  Nombre text primary key
);

create table Tratamientos (
  Id integer primary key,
  Titulo text not null,
  Vehiculo integer references Vehiculos(Id),
  FechaInicio datetime check(FechaInicio <= getdate()) default(getdate()),
  FechaFin datetime check(FechaFin <= getdate()),
  Costo integer check(Costo > 0),
  check(FechaInicio < FechaFin)
);

create table TratamientosInsumos (
  Tratamiento integer references Tratamientos(Id),
  Insumo text references Insumos(Nombre),
  Cantidad integer check(Cantidad > 0),
  primary key (Tratamiento, Insumo)
);

create table TratamientosRepuestos (
  Tratamiento integer references Tratamientos(Id),
  Repuesto text references Repuestos(Nombre),
  Cantidad integer check(Cantidad > 0),
  primary key (Tratamiento, Repuesto)
);