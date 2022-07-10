import React, { useContext } from "react";
import styled from "styled-components/native";

import Button from "./Button";

import { ClientsContext } from "./ClientsContext";

const Table = styled.View`
  width: 90%;
  margin: 10px 0px;
`;

const Row = styled.TouchableHighlight`
  border: 1px solid black;
`;

const Text = styled.Text`
  color: black;
  font-size: 16px;
  width: 100%;
  padding-left: 5px;
`;

export default function InsumosTable({ navigation }) {
  const { insumos } = useContext(ClientsContext);

  return (
    <>
      <Table>
        {insumos && insumos.length > 0 ? (
          insumos.map((insumo, index) => {
            return (
              <Row
                key={index}
                onPress={() => {
                  navigation.navigate("Insumo", {
                    insID: insumo.Id,
                  });
                }}
              >
                <Text>{`${insumo.Id} - ${insumo.Nombre}`}</Text>
              </Row>
            );
          })
        ) : (
          <Text>No hay insumos</Text>
        )}
      </Table>
      <Button path="Nuevo Insumo" navigation={navigation}>
        Nuevo Insumo
      </Button>
    </>
  );
}
