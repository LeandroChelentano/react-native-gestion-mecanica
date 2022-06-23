import React, { useEffect, useState } from "react";
import styled from "styled-components/native";

import Title from "../../components/Title";
import ClientesTable from "../../components/ClientesTable";

import { ClientsContext } from "../../components/ClientsContext";

const Container = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default function Clients({ navigation }) {
  const { clientes } = React.useContext(ClientsContext);

  return (
    <Container>
      <Title>Administración de clientes</Title>
      <ClientesTable navigation={navigation} />
    </Container>
  );
}
