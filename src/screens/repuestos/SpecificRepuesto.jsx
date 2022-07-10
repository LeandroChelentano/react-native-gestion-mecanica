import React, { useContext, useEffect } from "react";
import styled from "styled-components/native";

import Title from "../../components/Title";
import Subtitle from "../../components/Subtitle";

import { ClientsContext } from "../../components/ClientsContext";

import { db } from "../../db/Queries";

const Container = styled.View`
  padding: 15px 15px 0 15px;
`;

const P = styled.Text`
  font-size: 17px;
`;

const PB = styled.Text`
  font-weight: bold;
  font-size: 18px;
  margin-top: 15px;
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

const Edit = styled.TouchableHighlight`
  width: 100%;
  border: 2px solid #00ffff;
  border-radius: 6px;
  padding: 3px 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

export default function SpecificRepuesto({ route, navigation }) {
  const [repuesto, setRepuesto] = React.useState(null);

  const { repuestos, setRepuestos } = React.useContext(ClientsContext);

  const { repID } = route.params;

  useEffect(() => {
    if (repuesto == null) {
      repuestos.forEach((i) => {
        if (i.Id == repID) setRepuesto(i);
      });
    }
  }, [repID]);

  const updateRootList = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM Repuestos WHERE Id=?;`,
        [repuesto.Id],
        (_, results) => {
          let temp = new Array();

          for (let i = 0; i < repuestos.length; ++i)
            if (repuestos[i].Id != repuesto.Id) temp.push(repuestos[i]);

          setRepuestos(temp);
          navigation.navigate("Repuestos");
        },
        (_, error) => {
          console.log(error);
        }
      );
    });
  };

  const handleDelete = () => {
    updateRootList();
  };

  return (
    <Container>
      <Subtitle>Identificador: {repuesto?.Id}</Subtitle>
      <PB>Repuesto: {repuesto?.Nombre}</PB>
      <Edit
        onPress={() => {
          navigation.navigate("Editar Repuesto", { repID: repID });
        }}
      >
        <P>Editar repuesto</P>
      </Edit>
      <Delete onPress={() => handleDelete()}>
        <P>Eliminar repuesto</P>
      </Delete>
    </Container>
  );
}
