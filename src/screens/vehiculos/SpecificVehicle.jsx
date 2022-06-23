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

const Edit = styled.TouchableHighlight`
  width: 100%;
  border: 2px solid #00ffff;
  border-radius: 6px;
  padding: 3px 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
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

export default function SpecificVehicle({ route, navigation }) {
  const [vehicle, setVehicle] = React.useState(null);

  const { vehiculos, setVehiculos } = useContext(ClientsContext);

  const { vehicleMAT } = route.params;

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    if (!vehicle) {
      const aux = vehiculos.find((vehi) => vehi.Matricula === vehicleMAT);
      setVehicle(aux);
    }
  };

  const updateRootList = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM Vehiculos WHERE Matricula=?;`,
        [vehicle.Matricula],
        (_, results) => {
          let temp = new Array();

          for (let i = 0; i < vehiculos.length; ++i)
            if (vehiculos[i].Matricula != vehicle.Matricula)
              temp.push(vehiculos[i]);

          setVehiculos(temp);
        },
        (_, error) => {
          console.log(error);
        }
      );
    });
  };

  const handleDelete = () => {
    updateRootList();
    navigation.navigate("Vehiculos");
  };

  return (
    <Container>
      <Subtitle>SERIAL: {vehicle?.serial}</Subtitle>
      <Title>{vehicle?.Matricula}</Title>
      <PB>Características:</PB>
      <P>Color: {vehicle?.Color}</P>
      <P>Marca: {vehicle?.Marca}</P>
      <Edit
        onPress={() => {
          navigation.navigate("Editar Vehiculo", {
            vehicleMAT: vehicle.Matricula,
          });
        }}
      >
        <P>Editar vehiculo</P>
      </Edit>
      <Delete onPress={() => handleDelete()}>
        <P>Eliminar vehiculo</P>
      </Delete>
    </Container>
  );
}
