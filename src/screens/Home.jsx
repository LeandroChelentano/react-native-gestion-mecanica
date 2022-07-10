import React from "react";
import styled from "styled-components/native";

import Button from "../components/Button";
import Title from "../components/Title";
import Subtitle from "../components/Subtitle";

import { createTables } from "../db/Queries";

const Container = styled.ScrollView`
  padding: 15px;
  padding-top: 0px;
  margin-bottom: 15px;
`;

export default function Home({ navigation }) {
  React.useEffect(() => {
    createTables();
  });

  return (
    <Container
      contentContainerStyle={{
        flex: 1,
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Title>Car Treatment Center</Title>
      <Subtitle>Por: Leandro Chelentano</Subtitle>
      <Button path="Clientes" navigation={navigation}>
        Ver los clientes
      </Button>
      <Button path="Vehiculos" navigation={navigation}>
        Ver los vehiculos
      </Button>
      <Button path="Reparaciones" navigation={navigation}>
        Ver las reparaciones
      </Button>
      <Button path="Insumos" navigation={navigation}>
        Ver los insumos
      </Button>
      <Button path="Repuestos" navigation={navigation}>
        Ver los repuestos
      </Button>
    </Container>
  );
}
