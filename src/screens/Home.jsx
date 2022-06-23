import React from "react";
import styled from "styled-components/native";

import Button from "../components/Button";
import Title from "../components/Title";

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
      <Button path="Clientes" navigation={navigation}>
        Ver los clientes
      </Button>
      <Button path="Vehiculos" navigation={navigation}>
        Ver los vehiculos
      </Button>
      <Button path="Reparaciones" navigation={navigation}>
        Ver las reparaciones
      </Button>
    </Container>
  );
}
