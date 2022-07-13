import React, { useContext, useEffect } from "react";
import styled from "styled-components/native";

import Title from "../../components/Title";
import Subtitle from "../../components/Subtitle";

import { ClientsContext } from "../../components/ClientsContext";

import { db } from "../../db/Queries";

const Container = styled.ScrollView`
  padding: 15px 15px 0 15px;
`;

const VehiclesContainer = styled.ScrollView`
  display: flex;
  flex-direction: column;
  margin: 5px 0px;
  padding: 0 5px;
  height: 150px;
  border: 1px solid #d3d3d3;
  width: 100%;
`;

const Row = styled.TouchableHighlight`
  margin-top: 5px;
  padding: 5px;
  border: 1px solid gray;
`;

const Selected = styled.TouchableHighlight`
  margin: 5px 0 5px 0;
  padding: 5px;
  border: 1px solid gray;
  background-color: #d3d3d3;
  width: 40%;
`;

const InputDiv = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
`;

const InputCI = styled.TextInput`
  padding: 3px 5px;
  border: 1px solid #d3d3d3;
  color: #000000;
  font-size: 17px;
  width: 30%;
  margin: 5px;
`;

const Apply = styled.TouchableHighlight`
  width: 25%;
  border: 2px solid lightgreen;
  background-color: lightgreen;
  padding: 4px 5px;
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
  margin: 20px 0px 30px 0;
`;

export default function TratamientosRepuesto({ route, navigation }) {
  const [treatment, setTreatment] = React.useState(null);
  const [cliente, setCliente] = React.useState(null);
  const [vehicle, setVehicle] = React.useState(null);
  const [usados, setUsados] = React.useState(null);
  const [selectedRepuesto, setSelectedRepuesto] = React.useState(null);
  const [cantidad, setCantidad] = React.useState(null);

  const {
    clientes,
    reparaciones,
    setReparaciones,
    vehiculos,
    reparacionRepuesto,
    setReparacionRepuesto,
    repuestos,
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
      let reps = [];
      reparacionRepuesto.forEach((rr) => {
        console.log("line 152", rr);
        if (rr.Tratamiento == reparacion.Id)
          reps.push({ Repuesto: rr.Repuesto, Cantidad: rr.Cantidad });
      });
      setTreatment(reparacion);
      setCliente(cliente);
      setVehicle(vehiculo);
      setUsados(reps);
    }
  };

  const updateRootList = (query, existia, cant) => {
    db.transaction((tx) => {
      tx.executeSql(
        query,
        [cant, selectedRepuesto.Id, treatment.Id],
        (_, results) => {
          if (existia) {
            //Se hizo un update
            let temp = new Array();

            for (let i = 0; i < reparacionRepuesto.length; ++i)
              if (
                reparacionRepuesto[i].Tratamiento != treatment.Id &&
                reparacionRepuesto[i].Repuesto != selectedRepuesto.Id
              )
                temp.push(reparacionRepuesto[i]);

            const obj = {
              Tratamiento: treatment.Id,
              Repuesto: selectedRepuesto.Id,
              Cantidad: cant,
            };

            temp.push(obj);
            setReparacionRepuesto(temp);

            let temp2 = [];
            usados.forEach((usado) => {
              if (usado.Repuesto != selectedRepuesto.Id) temp2.push(usado);
            });
            temp2.push(obj);
            setUsados(temp2);
          } else {
            //Se hizo un insert
            let temp = new Array();
            for (let i = 0; i < reparacionRepuesto.length; ++i) {
              temp.push(reparacionRepuesto[i]);
            }

            let obj = {
              Tratamiento: treatment.Id,
              Repuesto: selectedRepuesto.Id,
              Cantidad: cant,
            };
            temp.push(obj);
            setUsados([...usados, obj]);
            setReparacionRepuesto(temp);
          }
        },
        (_, error) => {
          console.log(error);
        }
      );
    });
  };

  const updateRootListOnDelete = (repuesto) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM TratamientosRepuestos WHERE Tratamiento = ? AND Repuesto = ?;",
        [treatment.Id, repuesto],
        (_, results) => {
          let temp = new Array();
          usados.forEach((usado) => {
            if (usado.Repuesto != repuesto) temp.push(usado);
          });
          setUsados(temp);

          let aux = [];
          reparacionRepuesto.forEach((usado) => {
            if (usado.Repuesto != repuesto) aux.push(usado);
          });
          setReparacionRepuesto(aux);
        },
        (_, error) => {
          console.log(error);
        }
      );
    });
  };

  const handleAdd = () => {
    if (selectedRepuesto == null) return;

    let existe = false;
    let c = 0;
    usados.forEach((usado) => {
      if (usado.Repuesto === selectedRepuesto.Id) {
        existe = true;
        c = usado.Cantidad;
      }
    });
    let query = existe
      ? "UPDATE TratamientosRepuestos SET Cantidad = ? WHERE Repuesto = ? AND Tratamiento = ?"
      : "INSERT INTO TratamientosRepuestos (Cantidad, Repuesto, Tratamiento) VALUES (?, ?, ?);";

    let cant = existe ? parseInt(c) + parseInt(cantidad) : parseInt(cantidad);
    updateRootList(query, existe, cant);
  };

  const handleDelete = (repuesto) => {
    if (repuesto == null || repuesto.length == 0) return;

    updateRootListOnDelete(repuesto);
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
      <PB>Costo: ${treatment?.Costo || 0}</PB>
      <InputDiv>
        <Selected onPress={() => setSelectedRepuesto(null)}>
          {selectedRepuesto == null ? (
            <P>Seleccion vacia.</P>
          ) : (
            <P>{selectedRepuesto?.Nombre}</P>
          )}
        </Selected>
        <InputCI
          placeholder="Cantidad"
          onChangeText={(text) => setCantidad(text)}
        />
        <Apply onPress={() => handleAdd()}>
          <P>Finalizar</P>
        </Apply>
      </InputDiv>

      <VehiclesContainer>
        {repuestos.map((r) => {
          if (r.Id === selectedRepuesto?.Id) return null;
          return (
            <Row key={r.Id} onPress={() => setSelectedRepuesto(r)}>
              <P>{r.Nombre}</P>
            </Row>
          );
        })}
      </VehiclesContainer>

      <PB>Toca para eliminar:</PB>
      {usados?.length > 0 ? null : (
        <P>La reparacion no tiene asociada repuestos.</P>
      )}
      {usados?.map((usado) => {
        const rep = repuestos.find((r) => r.Id === usado.Repuesto);
        return (
          <P
            key={rep.Id}
            onPress={() => handleDelete(rep.Id)}
          >{`[${usado.Cantidad}] - ${rep?.Nombre}`}</P>
        );
      })}

      <Save onPress={() => navigation.navigate("Reparaciones")}>
        <P>Hecho</P>
      </Save>
    </Container>
  );
}
