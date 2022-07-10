import React, { useContext, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import styled from "styled-components/native";

import Title from "../../components/Title";
import Subtitle from "../../components/Subtitle";

import { ClientsContext } from "../../components/ClientsContext";

import { db } from "../../db/Queries";

const Container = styled.View`
  padding-left: 15px;
  padding-right: 15px;
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

export default function SpecificClient({ route, navigation }) {
  const [user, setUser] = React.useState(null);
  const [vehicle, setVehicle] = React.useState(null);

  const { clientes, setClientes, vehiculos } = useContext(ClientsContext);

  const { clientID } = route.params;

  useEffect(() => {
    console.log("useEffect called");
    getData();
  }, []);

  const getData = () => {
    console.log("useFocusEffect called");
    if (!user) {
      const cliente = clientes.find((cliente) => cliente.Id === clientID);
      if (cliente) setUser(cliente);

      if (cliente?.Vehiculo) {
        const veh = vehiculos.find((vehi) => vehi.Id === cliente.Vehiculo);
        setVehicle(veh);
      }
    }
  };

  const updateRootList = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM Clientes WHERE Id=?;`,
        [user.Id],
        (_, results) => {
          let temp = new Array();

          for (let i = 0; i < clientes.length; ++i)
            if (clientes[i].CI != user.CI) temp.push(clientes[i]);

          setClientes(temp);
        },
        (_, error) => {
          console.log(error);
        }
      );
    });
  };

  const handleDelete = () => {
    updateRootList();
    navigation.navigate("Clientes");
  };

  return (
    <Container>
      <Title>
        {user?.Nombre} {user?.Apellido}
      </Title>
      <Subtitle>CI: {user?.CI}</Subtitle>
      <PB>Su vehiculo:</PB>
      {vehicle === null ? (
        <P>No tiene vehiculo registrado</P>
      ) : (
        <P>{`Matricula: ${vehicle.Matricula}\n\tMarca: "${vehicle.Marca}"\n\tSerial:  "${vehicle.serial}"`}</P>
      )}
      <Edit
        onPress={() => {
          navigation.navigate("Editar Cliente", { clientID: clientID });
        }}
      >
        <P>Editar cliente</P>
      </Edit>
      <Delete onPress={() => handleDelete()}>
        <P>Eliminar cliente</P>
      </Delete>
    </Container>
  );
}
