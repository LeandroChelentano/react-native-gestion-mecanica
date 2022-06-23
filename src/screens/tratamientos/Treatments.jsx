import React, { useEffect, useState } from "react";
import styled from "styled-components/native";

import Title from "../../components/Title";
import TreatmentsTable from "../../components/TreatmentsTable";

const Container = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default function Treatments({ navigation }) {
  return (
    <Container>
      <Title>Administración de reparaciones</Title>
      <TreatmentsTable navigation={navigation} />
    </Container>
  );
}
