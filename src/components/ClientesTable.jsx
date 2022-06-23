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

export default function ClientesTable({ navigation }) {
  const { clientes } = useContext(ClientsContext);

  return (
    <>
      <Table>
        {clientes && clientes.length > 0 ? (
          clientes.map((cliente, index) => {
            return (
              <Row
                key={index}
                onPress={() => {
                  navigation.navigate("Cliente", { clientCI: cliente.CI });
                }}
              >
                <Text>{`${cliente.Nombre} ${cliente.Apellido}\n\t${cliente.CI}`}</Text>
              </Row>
            );
          })
        ) : (
          <Text>No hay clientes</Text>
        )}
      </Table>
      <Button path="Nuevo Cliente" navigation={navigation}>
        Nuevo cliente
      </Button>
    </>
  );
}
