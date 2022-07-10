import React, { useEffect, useState } from "react";
import styled from "styled-components/native";

import Title from "../../components/Title";
import RepuestosTable from "../../components/RepuestosTable";

const Container = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default function Repuestos({ navigation }) {
  return (
    <Container>
      <Title>Administración de repuestos</Title>
      <RepuestosTable navigation={navigation} />
    </Container>
  );
}
