import React, { useEffect, useState } from "react";
import styled from "styled-components/native";

import Title from "../../components/Title";
import VehiclesTable from "../../components/VehiclesTable";

import { ClientsContext } from "../../components/ClientsContext";

const Container = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default function Vehicles({ navigation }) {
  return (
    <Container>
      <Title>Administración de vehiculos</Title>
      <VehiclesTable navigation={navigation} />
    </Container>
  );
}
