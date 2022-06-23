import React from "react";
import styled from "styled-components/native";

import Button from "../components/Button";
import Title from "../components/Title";

import { createTables } from "../db/Queries";

const Container = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default function Home({ navigation }) {
  React.useEffect(() => {
    // createTables();
  });

  return (
    <Container>
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
