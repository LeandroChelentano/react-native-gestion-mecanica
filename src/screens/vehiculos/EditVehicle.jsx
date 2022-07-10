import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components/native";

import { ClientsContext } from "../../components/ClientsContext";

import { db } from "../../db/Queries";

import Subtitle from "../../components/Subtitle";
import Title from "../../components/Title";

import { Alert } from "react-native";

const Container = styled.View`
  padding: 15px 15px 0 15px;
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

const InputSub = styled.TextInput`
  padding: 3px 5px;
  border: 1px solid #d3d3d3;
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

export default function EditVehicle({ route, navigation }) {
  const [vehicle, setVehicle] = useState(null);

  const { vehiculos, setVehiculos } = useContext(ClientsContext);

  const { vehicleMAT } = route.params;

  useEffect(() => {
    if (!vehicle) {
      const aux = vehiculos.find((vehi) => vehi.Matricula === vehicleMAT);
      setVehicle(aux);
    }
  }, []);

  const updateRootList = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE Vehiculos SET Marca=?, Color=?, Matricula=? WHERE Id=?;`,
        [vehicle.Marca, vehicle.Color, vehicle.Matricula, vehicle.Id],
        (_, results) => {
          let temp = new Array();
          for (let i = 0; i < vehiculos.length; ++i)
            if (vehiculos[i].Id != vehicle.Id) temp.push(vehiculos[i]);

          temp.push(vehicle);
          setVehiculos(temp);
          navigation.navigate("Vehiculos");
        },
        (_, error) => {
          console.log(error);
        }
      );
    });
  };

  const handleSave = () => {
    let alreadyExists = false;
    vehiculos.forEach((v) => {
      if (v.Matricula == vehicle.Matricula && v.Id != vehicle.Id)
        alreadyExists = true;
    });

    if (alreadyExists) {
      Alert.alert(
        "Error",
        "La matricula ya se encuentra asociada a otro vehiculo",
        [{ text: "OK" }],
        { cancelable: false }
      );
      return;
    }

    updateRootList();
  };

  return (
    <Container>
      <Subtitle>SERIAL: {vehicle?.serial}</Subtitle>
      <Input
        placeholder="Matricula"
        defaultValue={vehicle?.Matricula}
        onChangeText={(text) => {
          setVehicle({ ...vehicle, Matricula: text });
        }}
      />
      <InputDiv>
        <InputSub
          placeholder="Marca"
          defaultValue={vehicle?.Marca}
          onChangeText={(text) => {
            setVehicle({ ...vehicle, Marca: text });
          }}
        />
        <InputSub
          placeholder="Color"
          defaultValue={vehicle?.Color}
          onChangeText={(text) => setVehicle({ ...vehicle, Color: text })}
        />
      </InputDiv>
      <Save onPress={() => handleSave()}>
        <P>Guardar</P>
      </Save>
      <Delete
        onPress={() => {
          navigation.navigate("Vehiculos");
        }}
      >
        <P>Cancelar</P>
      </Delete>
    </Container>
  );
}
