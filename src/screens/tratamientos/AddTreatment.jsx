import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components/native";

import { ClientsContext } from "../../components/ClientsContext";

import Subtitle from "../../components/Subtitle";
import Title from "../../components/Title";

import { db } from "../../db/Queries";

import { Alert } from "react-native";

const Container = styled.ScrollView`
  padding: 15px;
`;

const InputDiv = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 15px 0;
`;

const InputSub = styled.TextInput`
  padding: 3px 5px;
  margin-top: 5px;
  border: 1px solid #d3d3d3;
  font-size: 18px;
  width: 70%;
`;

const Save = styled.TouchableHighlight`
  width: 100%;
  border: 2px solid #00ff00;
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

const P = styled.Text`
  font-size: 17px;
`;

const PB = styled.Text`
  font-weight: bold;
  font-size: 18px;
  margin-top: 15px;
`;

const Row = styled.TouchableHighlight`
  margin-top: 5px;
  padding: 5px;
  border: 1px solid gray;
`;

const Selected = styled.TouchableHighlight`
  margin: 5px 0 10px 0;
  padding: 5px;
  border: 1px solid gray;
  background-color: #d3d3d3;
`;

const VehiclesContainer = styled.ScrollView`
  display: flex;
  flex-direction: column;
  margin: 5px 0px;
  padding: 0 5px;
  height: 250px;
  border: 1px solid #d3d3d3;
`;

export default function AddTreatment({ navigation }) {
  const [user, setUser] = useState(null);
  const [treatment, setTreatment] = useState({
    Titulo: "",
    Costo: "",
    FechaInicio: "",
  });

  const {
    clientes,
    reparaciones,
    setReparaciones,
    reparacionRepuesto,
    setReparacionRepuesto,
    reparacionInsumo,
    setReparacionInsumo,
  } = useContext(ClientsContext);

  const updateRootList = () => {
    let id = newId();
    let date = new Date();
    date = date.toLocaleDateString("es-UY");
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO Tratamientos (Id, Titulo, Cliente, FechaInicio) VALUES (?, ?, ?, ?);`,
        [id, treatment.Titulo, treatment.Cliente, date],
        (_, results) => {
          let aux = new Array();

          reparaciones.forEach((r) => {
            aux.push(r);
          });

          treatment.Id = id;
          treatment.FechaInicio = date;
          aux.push(treatment);
          setReparaciones(aux);

          let temp = new Array();
          reparacionRepuesto.forEach((rr) => {
            if (rr.Tratamiento != id) {
              temp.push(rr);
            }
          });
          setReparacionRepuesto(temp);

          let temp2 = new Array();
          reparacionInsumo.forEach((ri) => {
            if (ri.Tratamiento != id) {
              temp2.push(ri);
            }
          });
          setReparacionInsumo(temp2);

          navigation.navigate("Reparaciones");
        },
        (_, error) => {
          console.log(error);
        }
      );
    });
  };

  const newId = () => {
    let id = 0;
    reparaciones.forEach((r) => {
      if (r.Id > id) id = r.Id;
    });
    return id + 1;
  };

  const handleSave = () => {
    if (treatment.Titulo == "" || treatment.Cliente == null) {
      Alert.alert("Error", "Hay elementos en blanco", [{ text: "OK" }], {
        cancelable: false,
      });
      return;
    }

    try {
      if (isNaN(treatment.Costo)) throw error;
    } catch (error) {
      Alert.alert("Error", "El costo debe ser numerico", [{ text: "OK" }], {
        cancelable: false,
      });
      return;
    }

    let tieneVehiculo = false;
    clientes.forEach((c) => {
      if (c.Id == treatment.Cliente) {
        if (c.Vehiculo != null) {
          tieneVehiculo = true;
        }
      }
    });

    if (!tieneVehiculo) {
      Alert.alert(
        "Error",
        "El cliente seleccionado no posee un vehiculo",
        [{ text: "OK" }],
        {
          cancelable: false,
        }
      );
      return;
    }

    updateRootList();
  };

  return (
    <Container
      contentContainerStyle={{
        flex: 1,
        flexDirection: "column",
      }}
    >
      <InputSub
        placeholder="Titulo"
        defaultValue={treatment?.Titulo}
        onChangeText={(text) => {
          setTreatment({ ...treatment, Titulo: text });
        }}
      />
      <Selected
        onPress={() => {
          setUser(null);
          setTreatment({ ...treatment, Cliente: null });
        }}
      >
        {treatment?.Cliente == null ? (
          <P>{`Seleccione un cliente.\n\n`}</P>
        ) : (
          <P>{`${user.Nombre} ${user.Apellido}\n\t${user.CI}`}</P>
        )}
      </Selected>
      <PB>Clientes:</PB>
      <VehiclesContainer>
        {clientes.map((c) => {
          if (c.Id === treatment?.Cliente) return null;
          return (
            <Row
              key={c.CI}
              onPress={() => {
                setUser(c);
                setTreatment({ ...treatment, Cliente: c.Id });
              }}
            >
              <P>{`${c.Nombre} ${c.Apellido}\n\t${c.CI}`}</P>
            </Row>
          );
        })}
      </VehiclesContainer>
      <Save onPress={() => handleSave()}>
        <P>Guardar</P>
      </Save>
      <Delete onPress={() => navigation.navigate("Reparaciones")}>
        <P>Cancelar</P>
      </Delete>
    </Container>
  );
}
