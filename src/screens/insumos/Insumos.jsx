import React, { useEffect, useState } from "react";
import styled from "styled-components/native";

import Title from "../../components/Title";
// import TreatmentsTable from "../../components/TreatmentsTable";
import InsumosTable from "../../components/InsumosTable";

const Container = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default function Insumos({ navigation }) {
  return (
    <Container>
      <Title>Administración de insumos</Title>
      <InsumosTable navigation={navigation} />
    </Container>
  );
}
