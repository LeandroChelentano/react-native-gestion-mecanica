import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components/native";

import { ClientsContext } from "../../components/ClientsContext";

import { db } from "../../db/Queries";

const Container = styled.ScrollView`
  padding: 15px;
  padding-top: 0px;
  margin-bottom: 15px;
`;

const VehiclesContainer = styled.ScrollView`
  display: flex;
  flex-direction: column;
  margin: 5px 0px;
  padding: 0 5px;
  height: 250px;
  border: 1px solid #d3d3d3;
  width: 100%;
`;

const InputDiv = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 15px 0;
`;

const Input = styled.TextInput`
  padding: 3px 5px;
  border: 1px solid #000000;
  font-size: 24px;
  font-weight: bold;
  width: 49%;
`;

const InputCI = styled.TextInput`
  padding: 3px 5px;
  border: 1px solid #d3d3d3;
  color: #000000;
  font-size: 18px;
  width: 49%;
`;

const Save = styled.TouchableHighlight`
  width: 100%;
  border: 2px solid #00ff00;
  border-radius: 6px;
  padding: 3px 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const Delete = styled.TouchableHighlight`
  width: 100%;
  border: 2px solid #ff0000;
  border-radius: 6px;
  padding: 3px 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
`;

const P = styled.Text`
  font-size: 17px;
`;

const PB = styled.Text`
  font-weight: bold;
  font-size: 18px;
  margin-top: 15px;
`;

const Row = styled.TouchableHighlight`
  margin-top: 5px;
  padding: 5px;
  border: 1px solid gray;
`;

const Selected = styled.TouchableHighlight`
  margin: 5px 0 10px 0;
  padding: 5px;
  border: 1px solid gray;
  background-color: #d3d3d3;
  width: 100%;
`;

export default function EditClient({ navigation }) {
  const [user, setUser] = useState({
    Nombre: "",
    Apellido: "",
    CI: "",
    Vehiculo: null,
  });
  const [vehicle, setVehicle] = useState(null);

  const { clientes, setClientes, vehiculos } = useContext(ClientsContext);

  const getNoOwnerVehicles = () => {
    let toBeReturned = new Array();

    vehiculos.forEach((veh) => {
      if (!isInUse(veh.Matricula)) {
        toBeReturned.push(veh);
      }
    });

    return toBeReturned;
  };

  const isInUse = (mat) => {
    clientes.forEach((cli) => {
      if (cli.Vehiculo == mat) return true;
    });

    return false;
  };

  const updateRootList = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO Clientes (Nombre, Apellido, CI, Vehiculo) VALUES (?, ?, ?, ?);`,
        [user.Nombre, user.Apellido, user.CI, user.Vehiculo],
        (_, results) => {
          let temp = new Array();
          clientes.forEach((c) => {
            temp.push(c);
          });
          temp.push(user);

          setClientes(temp);
          navigation.navigate("Clientes");
        },
        (_, error) => {
          console.log(error);
        }
      );
    });
  };

  const handleSave = () => {
    if (
      user.Nombre == "" ||
      user.Apellido == "" ||
      user.CI == "" ||
      user.CI.length > 8
    )
      return;

    try {
      parseInt(user.CI);
    } catch {
      return;
    }

    let alreadyExists = false;
    clientes.forEach((c) => {
      if (c.CI == user.CI) alreadyExists = true;
    });

    if (alreadyExists) return;

    updateRootList();
  };

  return (
    <Container
      contentContainerStyle={{
        flex: 1,
        flexDirection: "column",
      }}
    >
      <InputDiv>
        <Input
          placeholder="Nombre"
          defaultValue={user?.Nombre}
          onChangeText={(text) => {
            setUser({ ...user, Nombre: text });
          }}
        />
        <Input
          placeholder="Apellido"
          defaultValue={user?.Apellido}
          onChangeText={(text) => setUser({ ...user, Apellido: text })}
        />
      </InputDiv>
      <InputCI
        placeholder="Cedula"
        defaultValue={user?.CI}
        onChangeText={(text) => setUser({ ...user, CI: text })}
      />
      <PB>Vehiculo en propiedad:</PB>
      <Selected
        onPress={() => {
          setVehicle(null);
          setUser({ ...user, Vehiculo: null });
        }}
      >
        {vehicle == null ? (
          <P>{`No tiene vehiculo asignado.\n\n`}</P>
        ) : (
          <P>{`Matricula: ${vehicle.Matricula}\n\tMarca: "${vehicle.Marca}"\n\tSerial:  "${vehicle.serial}"`}</P>
        )}
      </Selected>
      <PB>Vehiculos sin propietario:</PB>
      <VehiclesContainer>
        {getNoOwnerVehicles().map((v) => {
          if (v.Matricula === vehicle?.Matricula) return null;
          return (
            <Row
              key={v.Matricula}
              onPress={() => {
                setVehicle(v);
                setUser({ ...user, Vehiculo: v.Matricula });
              }}
            >
              <P>{`Matricula: ${v.Matricula}\n\tMarca: "${v.Marca}"\n\tSerial:  "${v.serial}"`}</P>
            </Row>
          );
        })}
      </VehiclesContainer>
      <Save onPress={() => handleSave()}>
        <P>Guardar</P>
      </Save>
      <Delete onPress={() => navigation.navigate("Clientes")}>
        <P>Cancelar</P>
      </Delete>
    </Container>
  );
}
