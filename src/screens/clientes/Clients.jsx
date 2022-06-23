import React, { useEffect, useState } from "react";
import styled from "styled-components/native";

import Title from "../../components/Title";
import ClientesTable from "../../components/ClientesTable";

const Container = styled.ScrollView`
  padding: 15px;
  padding-top: 0px;
  margin-bottom: 15px;
`;

export default function Clients({ navigation }) {
  return (
    <Container
      contentContainerStyle={{
        flex: 1,
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Title>Administración de clientes</Title>
      <ClientesTable navigation={navigation} />
    </Container>
  );
}
