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

export default function VehiclesTable({ navigation }) {
  const { vehiculos } = useContext(ClientsContext);

  return (
    <>
      <Table>
        {vehiculos && vehiculos.length > 0 ? (
          vehiculos.map((vehiculo, index) => {
            return (
              <Row
                key={index}
                onPress={() => {
                  navigation.navigate("Vehiculo", {
                    vehicleMAT: vehiculo.Matricula,
                  });
                }}
              >
                <Text>{`Matricula: ${vehiculo.Matricula}\n\tMarca: "${vehiculo.Marca}"\n\tSerial:  "${vehiculo.serial}"`}</Text>
              </Row>
            );
          })
        ) : (
          <Text>No hay vehiculos</Text>
        )}
      </Table>
      <Button path="Nuevo Vehiculo" navigation={navigation}>
        Nuevo vehiculo
      </Button>
    </>
  );
}
