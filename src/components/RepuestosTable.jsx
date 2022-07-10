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
  const { repuestos } = useContext(ClientsContext);

  return (
    <>
      <Table>
        {repuestos && repuestos.length > 0 ? (
          repuestos.map((repuesto, index) => {
            return (
              <Row
                key={index}
                onPress={() => {
                  navigation.navigate("Repuesto", {
                    repID: repuesto.Id,
                  });
                }}
              >
                <Text>{`${repuesto.Id} - ${repuesto.Nombre}`}</Text>
              </Row>
            );
          })
        ) : (
          <Text>No hay repuestos</Text>
        )}
      </Table>
      <Button path="Nuevo Repuesto" navigation={navigation}>
        Nuevo Repuesto
      </Button>
    </>
  );
}
