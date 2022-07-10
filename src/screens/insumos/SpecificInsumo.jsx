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

export default function SpecificInsumo({ route, navigation }) {
  const [insumo, setInsumo] = React.useState(null);

  const { insumos, setInsumos } = React.useContext(ClientsContext);

  const { insID } = route.params;

  useEffect(() => {
    if (insumo == null) {
      insumos.forEach((i) => {
        if (i.Id == insID) setInsumo(i);
      });
    }
  }, [insID]);

  const updateRootList = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM Insumos WHERE Id=?;`,
        [insumo.Id],
        (_, results) => {
          let temp = new Array();

          for (let i = 0; i < insumos.length; ++i)
            if (insumos[i].Id != insumo.Id) temp.push(insumos[i]);

          setInsumos(temp);
          navigation.navigate("Insumos");
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
      <Subtitle>Identificador: {insumo?.Id}</Subtitle>
      <PB>Insumo: {insumo?.Nombre}</PB>
      <Edit
        onPress={() => {
          navigation.navigate("Editar Insumo", { insID: insID });
        }}
      >
        <P>Editar cliente</P>
      </Edit>
      <Delete onPress={() => handleDelete()}>
        <P>Eliminar insumo</P>
      </Delete>
    </Container>
  );
}
