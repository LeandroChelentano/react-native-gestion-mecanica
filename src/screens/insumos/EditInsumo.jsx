import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components/native";

import { ClientsContext } from "../../components/ClientsContext";

import { db } from "../../db/Queries";

import Subtitle from "../../components/Subtitle";

import { Alert } from "react-native";

const Container = styled.ScrollView`
  padding: 15px;
`;

const VehiclesContainer = styled.ScrollView`
  display: flex;
  flex-direction: column;
  margin: 5px 0px;
  padding: 0 5px;
  height: 250px;
  border: 1px solid #d3d3d3;
`;

const InputDiv = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const Input = styled.TextInput`
  padding: 3px 5px;
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
`;

const InputSub = styled.TextInput`
  padding: 3px 5px;
  border: 1px solid #d3d3d3;
  font-size: 18px;
  width: 49%;
`;

export default function EditInsumo({ route, navigation }) {
  const [insumo, setInsumo] = useState(null);

  const { insumos, setInsumos } = useContext(ClientsContext);

  const { insID } = route.params;

  useEffect(() => {
    if (insumo == null) {
      const ins = insumos.find((i) => i.Id === insID);
      setInsumo(ins);
    }
  }, []);

  const updateRootList = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE Insumos SET Nombre=? WHERE Id=?;`,
        [insumo.Nombre, insumo.Id],
        (_, results) => {
          let temp = new Array();

          for (let i = 0; i < insumos.length; ++i)
            if (insumos[i].Id != insumo.Id) temp.push(insumos[i]);

          temp.push(insumo);
          setInsumos(temp);
        },
        (_, error) => {
          console.log(error);
        }
      );
    });
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
      if (i.Nombre == insumo.Nombre && i.Id != insumo.Id) {
        existe = true;
      }
    });

    if (existe) {
      Alert.alert(
        "Error",
        "Ya hay un insumo con ese nombre",
        [{ text: "OK" }],
        {
          cancelable: false,
        }
      );
      return;
    }

    updateRootList();
    navigation.navigate("Insumos");
  };

  return (
    <Container
      contentContainerStyle={{
        flex: 1,
        flexDirection: "column",
      }}
    >
      <Subtitle>{`Identificador: ${insumo?.Id}\n`}</Subtitle>
      <Input
        placeholder="Nombre"
        defaultValue={insumo?.Nombre}
        onChangeText={(text) => {
          setInsumo({ ...insumo, Nombre: text });
        }}
      />
      <Save onPress={() => handleSave()}>
        <P>Guardar</P>
      </Save>
      <Delete
        onPress={() => {
          navigation.navigate("Insumos");
        }}
      >
        <P>Cancelar</P>
      </Delete>
    </Container>
  );
}
