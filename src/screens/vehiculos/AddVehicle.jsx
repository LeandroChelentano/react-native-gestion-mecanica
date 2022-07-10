import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components/native";

import { ClientsContext } from "../../components/ClientsContext";

import Subtitle from "../../components/Subtitle";
import Title from "../../components/Title";

import { db } from "../../db/Queries";

import { Alert } from "react-native";

const Container = styled.ScrollView`
  padding: 15px;
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
  margin-top: 5px;
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

export default function AddVehicle({ navigation }) {
  const [vehicle, setVehicle] = useState({
    serial: "",
    Matricula: "",
    Marca: "",
    Color: "",
  });

  const { vehiculos, setVehiculos } = useContext(ClientsContext);

  const updateRootList = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO Vehiculos (Id, Matricula, serial, Marca, Color) VALUES (?, ?, ?, ?, ?);`,
        [
          getId(),
          vehicle.Matricula,
          vehicle.serial,
          vehicle.Marca,
          vehicle.Color,
        ],
        (_, results) => {
          let aux = new Array();

          let id = 0;
          vehiculos.forEach((c) => {
            if (c.Id > id) id = c.Id;
          });
          vehicle.Id = id + 1;

          vehiculos.forEach((v) => {
            aux.push(v);
          });
          aux.push(vehicle);

          setVehiculos(aux);
          navigation.navigate("Vehiculos");
        },
        (_, error) => {
          console.log(error);
        }
      );
    });
  };

  const getId = () => {
    let id = 0;
    vehiculos.forEach((v) => {
      if (v.Id > id) id = v.Id;
    });
    return id + 1;
  };

  const handleSave = () => {
    if (
      vehicle.Matricula == "" ||
      vehicle.Color == "" ||
      vehicle.serial == "" ||
      vehicle.Marca == ""
    ) {
      Alert.alert("Error", "Hay elementos en blanco", [{ text: "OK" }], {
        cancelable: false,
      });
      return;
    }

    try {
      if (isNaN(vehicle.serial)) throw error;
    } catch (err) {
      Alert.alert("Error", "La serial debe ser numerica", [{ text: "OK" }], {
        cancelable: false,
      });
      return;
    }

    let alreadyExists = false;
    vehiculos.forEach((v) => {
      if (v.Matricula == vehicle.Matricula || v.serial == vehicle.serial)
        alreadyExists = true;
    });

    if (alreadyExists) {
      Alert.alert(
        "Error",
        "La serial y la matricula no pueden ser duplicadas",
        [{ text: "OK" }],
        { cancelable: false }
      );
      return;
    }

    updateRootList();
  };

  return (
    <Container
      contentContainerStyle={{
        flex: 1,
        flexDirection: "column",
      }}
    >
      <InputSub
        placeholder="Serial"
        defaultValue={vehicle?.serial}
        onChangeText={(text) => {
          setVehicle({ ...vehicle, serial: text });
        }}
      />
      <Input
        placeholder="Matricula"
        defaultValue={vehicle?.matricula}
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
      <Delete onPress={() => navigation.navigate("Vehiculos")}>
        <P>Cancelar</P>
      </Delete>
    </Container>
  );
}
