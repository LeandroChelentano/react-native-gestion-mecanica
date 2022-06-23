import React, { useContext, useEffect } from "react";
import styled from "styled-components/native";

import Title from "../../components/Title";
import Subtitle from "../../components/Subtitle";

import { ClientsContext } from "../../components/ClientsContext";

import { db } from "../../db/Queries";

const Container = styled.View`
  padding: 15px 15px 0 15px;
`;

const P = styled.Text`
  font-size: 17px;
`;

const PB = styled.Text`
  font-weight: bold;
  font-size: 18px;
  margin-top: 15px;
`;

const Delete = styled.TouchableHighlight`
  width: 100%;
  border: 2px solid #ff0000;
  border-radius: 6px;
  padding: 3px 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
`;

export default function SpecificTreatment({ route, navigation }) {
  const [treatment, setTreatment] = React.useState(null);

  const { reparaciones, setReparaciones } = useContext(ClientsContext);

  const { repID } = route.params;

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    if (!treatment) {
      const aux = reparaciones.find((rep) => rep.Id === repID);
      setTreatment(aux);
    }
  };

  const updateRootList = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM Tratamientos WHERE Id=?;`,
        [treatment.Id],
        (_, results) => {
          let temp = new Array();

          for (let i = 0; i < reparaciones.length; ++i)
            if (reparaciones[i].Id != treatment.Id) temp.push(reparaciones[i]);

          setReparaciones(temp);
          navigation.navigate("Reparaciones");
        },
        (_, error) => {
          console.log(error);
        }
      );
    });
  };

  const handleDelete = () => {
    updateRootList();
  };

  return (
    <Container>
      <Subtitle>IDENTIFICADOR: {treatment?.Id}</Subtitle>
      <Title>{treatment?.Titulo}</Title>
      <PB>Cliente: {treatment?.Cliente}</PB>
      <Delete onPress={() => handleDelete()}>
        <P>Eliminar vehiculo</P>
      </Delete>
    </Container>
  );
}
