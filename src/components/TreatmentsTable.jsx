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

export default function TreatmentsTable({ navigation }) {
  const { reparaciones } = useContext(ClientsContext);

  return (
    <>
      <Table>
        {reparaciones && reparaciones.length > 0 ? (
          reparaciones.map((reparacion, index) => {
            return (
              <Row
                key={index}
                onPress={() => {
                  navigation.navigate("Reparacion", {
                    repID: reparacion.Id,
                  });
                }}
              >
                <Text>{`${reparacion.Id}: ${reparacion.Titulo}\n\tCliente: ${reparacion.Cliente}\n\tCosto:   $${reparacion.Costo}`}</Text>
              </Row>
            );
          })
        ) : (
          <Text>No hay reparaciones</Text>
        )}
      </Table>
      <Button path="Nueva Reparacion" navigation={navigation}>
        Nueva Reparacion
      </Button>
    </>
  );
}
