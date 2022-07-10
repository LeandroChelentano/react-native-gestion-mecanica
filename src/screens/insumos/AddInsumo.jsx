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

const Input = styled.TextInput`
  padding: 3px 5px;
  margin-top: 5px;
  border: 1px solid #000000;
  font-size: 24px;
  font-weight: bold;
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

export default function AddInsumo({ navigation }) {
  const [insumo, setInsumo] = useState({
    Nombre: "",
  });

  const { insumos, setInsumos } = useContext(ClientsContext);

  const updateRootList = () => {
    let id = getId();
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO Insumos (Id, Nombre) VALUES (?, ?);`,
        [id, insumo.Nombre],
        (_, results) => {
          let aux = new Array();

          insumos.forEach((r) => {
            aux.push(r);
          });
          insumo.Id = id;
          aux.push(insumo);

          setInsumos(aux);
          navigation.navigate("Insumos");
        },
        (_, error) => {
          console.log(error);
        }
      );
    });
  };

  const getId = () => {
    let id = 0;
    insumos.forEach((i) => {
      if (i.Id > id) id = i.Id;
    });
    return id + 1;
  };

  const handleSave = () => {
    if (insumo.Nombre == "") {
      Alert.alert("Error", "El nombre no puede estar vacío", [{ text: "OK" }], {
        cancelable: false,
      });
      return;
    }

    let existe = false;
    insumos.forEach((i) => {
      if (i.Nombre == insumo.Nombre) {
        existe = true;
      }
    });

    if (existe) {
      Alert.alert(
        "Error",
        "Ya hay un insumo con ese nombre",
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
      <Input
        placeholder="Nombre"
        defaultValue={insumo?.Nombre}
        onChangeText={(text) => {
          setInsumo({ Nombre: text });
        }}
      />
      <Save onPress={() => handleSave()}>
        <P>Guardar</P>
      </Save>
      <Delete onPress={() => navigation.navigate("Insumos")}>
        <P>Cancelar</P>
      </Delete>
    </Container>
  );
}
