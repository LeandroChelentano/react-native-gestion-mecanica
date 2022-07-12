import React, { useContext, useEffect } from "react";
import styled from "styled-components/native";

import Title from "../../components/Title";
import Subtitle from "../../components/Subtitle";

import { ClientsContext } from "../../components/ClientsContext";

import { db } from "../../db/Queries";

import { Alert } from "react-native";

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

const Final = styled.Text`
  font-weight: bold;
  font-size: 18px;
  margin: 15px 0;
  width: 100%;
  text-align: center;
  color: green;
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

const Edit = styled.TouchableHighlight`
  width: 100%;
  border: 2px solid #000;
  border-radius: 6px;
  padding: 3px 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
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

const InputCI = styled.TextInput`
  padding: 3px 5px;
  border: 1px solid #d3d3d3;
  color: #000000;
  font-size: 17px;
  width: 30%;
  margin: 5px;
`;

export default function SpecificTreatment({ route, navigation }) {
  const [treatment, setTreatment] = React.useState(null);
  const [cliente, setCliente] = React.useState(null);
  const [vehicle, setVehicle] = React.useState(null);

  const {
    clientes,
    reparaciones,
    setReparaciones,
    vehiculos,
    reparacionInsumo,
    setReparacionInsumo,
    reparacionRepuesto,
    setReparacionRepuesto,
  } = useContext(ClientsContext);

  const { repID } = route.params;

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    if (!treatment) {
      const reparacion = reparaciones.find((rep) => rep.Id === repID);
      const cliente = clientes.find((c) => c.Id === reparacion.Cliente);
      const vehiculo = vehiculos.find((v) => v.Id === cliente.Vehiculo);
      setTreatment(reparacion);
      setCliente(cliente);
      setVehicle(vehiculo);
    }
  };

  const updateRootListFinalizar = () => {
    let date = new Date().toLocaleDateString("es-UY");
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE Tratamientos SET FechaFin=? WHERE Id=?;`,
        [date, treatment.Id],
        (_, results) => {
          let temp = new Array();

          for (let i = 0; i < reparaciones.length; ++i)
            if (reparaciones[i].Id != treatment.Id) temp.push(reparaciones[i]);

          treatment.FechaFin = date;
          temp.push(treatment);
          setReparaciones(temp);
        },
        (_, error) => {
          console.log(error);
        }
      );
    });
  };

  const updateRootList = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM Tratamientos WHERE Id=?;`,
        [treatment.Id],
        (_, results) => {
          deleteFromRepuestos();
        },
        (_, error) => {
          console.log(error);
        }
      );
    });
  };

  const deleteFromRepuestos = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM TratamientosRepuestos WHERE Tratamiento=?;`,
        [treatment.Id],
        (_, results) => {
          deleteFromInsumos();
        },
        (_, error) => {
          console.log(error);
        }
      );
    });
  };

  const deleteFromInsumos = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM TratamientosInsumos WHERE Tratamiento=?;`,
        [treatment.Id],
        (_, results) => {
          let temp = new Array();
          for (let i = 0; i < reparaciones.length; ++i)
            if (reparaciones[i].Id != treatment.Id) temp.push(reparaciones[i]);
          setReparaciones(temp);

          let aux = [];
          for (let i = 0; i < reparacionRepuesto.length; ++i)
            if (reparacionRepuesto[i].Tratamiendo != treatment.Id)
              aux.push(reparacionRepuesto[i]);
          setReparacionRepuesto(aux);

          let aux2 = [];
          for (let i = 0; i < reparacionInsumo.length; ++i)
            if (reparacionInsumo[i].Tratamiendo != treatment.Id)
              aux2.push(reparacionInsumo[i]);
          setReparacionInsumo(aux2);

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

  const handleFinalizar = () => {
    updateRootListFinalizar();
  };

  const updateCosto = (costo) => {
    if (costo == null || costo.length == 0) return;

    try {
      if (isNaN(costo)) throw error;
    } catch (err) {
      Alert.alert("Error", "El cliente debe ser numerico", [{ text: "OK" }], {
        cancelable: false,
      });
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE Tratamientos SET Costo = ? WHERE Id = ?;",
        [costo, treatment.Id],
        (_, results) => {
          let temp = new Array();

          reparaciones.forEach((r) => {
            if (r.Id != treatment.Id) temp.push(usado);
          });

          treatment.Costo = parseInt(costo);
          temp.push(treatment);
          setReparaciones(temp);
          setTreatment({ ...treatment, Costo: parseInt(costo) });
        },
        (_, error) => {
          console.log(error);
        }
      );
    });
  };

  return (
    <Container>
      <Subtitle>IDENTIFICADOR: {treatment?.Id}</Subtitle>
      <Title>{treatment?.Titulo}</Title>
      <PB>
        Cliente: {cliente?.Nombre} {cliente?.Apellido} ({cliente?.CI})
      </PB>
      <PB>Matricula: {vehicle?.Matricula}</PB>
      <PB>Fecha de inicio: {treatment?.FechaInicio}</PB>
      <PB>Costo:</PB>
      <InputCI
        placeholder="Costo"
        defaultValue={treatment?.Costo == null ? "0" : `${treatment.Costo}`}
        onChangeText={(text) => updateCosto(text)}
      />
      {treatment?.FechaFin == null ? (
        <Save onPress={() => handleFinalizar()}>
          <P>Finalizar reparacion</P>
        </Save>
      ) : (
        <Final>Reparacion finalizada</Final>
      )}
      <Edit
        onPress={() =>
          navigation.navigate("Gestionar repuestos", { repID: repID })
        }
      >
        <P>Gestionar repuestos</P>
      </Edit>
      <Edit
        onPress={() =>
          navigation.navigate("Gestionar insumos", { repID: repID })
        }
      >
        <P>Gestionar insumos</P>
      </Edit>
      <Delete onPress={() => handleDelete()}>
        <P>Eliminar reparacion</P>
      </Delete>
    </Container>
  );
}
