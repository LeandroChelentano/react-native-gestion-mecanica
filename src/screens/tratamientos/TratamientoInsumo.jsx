import React, { useContext, useEffect } from "react";
import styled from "styled-components/native";

import Title from "../../components/Title";
import Subtitle from "../../components/Subtitle";

import { ClientsContext } from "../../components/ClientsContext";

import { db } from "../../db/Queries";
import SpecificRepuesto from "../repuestos/SpecificRepuesto";

const Container = styled.View`
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
  margin-top: 20px;
`;

export default function TratamientoInsumo({ route, navigation }) {
  const [treatment, setTreatment] = React.useState(null);
  const [cliente, setCliente] = React.useState(null);
  const [vehicle, setVehicle] = React.useState(null);
  const [usados, setUsados] = React.useState(null);
  const [selectedInsumo, setSelectedInsumo] = React.useState(null);
  const [cantidad, setCantidad] = React.useState(null);

  const {
    clientes,
    reparaciones,
    vehiculos,
    reparacionInsumo,
    setReparacionInsumo,
    insumos,
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
      let ins = [];
      reparacionInsumo.forEach((ri) => {
        if (ri.Tratamiento == reparacion.Id)
          ins.push({ Insumo: ri.Insumo, Cantidad: ri.Cantidad });
      });
      setTreatment(reparacion);
      setCliente(cliente);
      setVehicle(vehiculo);
      setUsados(ins);
    }
  };

  const updateRootList = (query, existia, cant) => {
    db.transaction((tx) => {
      tx.executeSql(
        query,
        [cant, selectedInsumo.Id, treatment.Id],
        (_, results) => {
          if (existia) {
            //Se hizo un update
            let temp = new Array();

            for (let i = 0; i < reparacionInsumo.length; ++i)
              if (
                reparacionInsumo[i].Reparacion != treatment.Id &&
                reparacionInsumo[i].Insumo != selectedInsumo.Id
              )
                temp.push(reparacionInsumo[i]);

            const obj = {
              Reparacion: treatment.Id,
              Insumo: selectedInsumo.Id,
              Cantidad: cant,
            };

            temp.push(obj);
            setReparacionInsumo(temp);

            let temp2 = [];
            usados.forEach((usado) => {
              if (usado.Insumo != selectedInsumo.Id) temp2.push(usado);
            });
            temp2.push(obj);
            setUsados(temp2);
          } else {
            //Se hizo un insert
            let temp = new Array();
            for (let i = 0; i < reparacionInsumo.length; ++i) {
              temp.push(reparacionInsumo[i]);
            }

            let obj = {
              Reparacion: treatment.Id,
              Insumo: selectedInsumo.Id,
              Cantidad: cant,
            };
            temp.push(obj);
            setUsados([...usados, obj]);
            setReparacionInsumo(temp);
          }
        },
        (_, error) => {
          console.log(error);
        }
      );
    });
  };

  const updateRootListOnDelete = (insumo) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM TratamientosInsumos WHERE Tratamiento = ? AND Insumo = ?;",
        [treatment.Id, insumo],
        (_, results) => {
          let temp = new Array();

          usados.forEach((usado) => {
            if (usado.Insumo != insumo) temp.push(usado);
          });

          setUsados(temp);
        },
        (_, error) => {
          console.log(error);
        }
      );
    });
  };

  const handleAdd = () => {
    if (selectedInsumo == null) return;

    let existe = false;
    let c = 0;
    usados.forEach((usado) => {
      if (usado.Insumo === selectedInsumo.Id) {
        existe = true;
        c = usado.Cantidad;
      }
    });
    let query = existe
      ? "UPDATE TratamientosInsumos SET Cantidad = ? WHERE Insumo = ? AND Tratamiento = ?"
      : "INSERT INTO TratamientosInsumos (Cantidad, Insumo, Tratamiento) VALUES (?, ?, ?);";

    let cant = existe ? parseInt(c) + parseInt(cantidad) : parseInt(cantidad);
    updateRootList(query, existe, cant);
  };

  const handleDelete = (insumo) => {
    if (insumo == null || insumo.length == 0) return;

    updateRootListOnDelete(insumo);
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
        <Selected onPress={() => setSelectedInsumo(null)}>
          {selectedInsumo == null ? (
            <P>Seleccion vacia.</P>
          ) : (
            <P>{selectedInsumo?.Nombre}</P>
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
        {insumos.map((i) => {
          if (i.Id === selectedInsumo?.Id) return null;
          return (
            <Row key={i.Id} onPress={() => setSelectedInsumo(i)}>
              <P>{i.Nombre}</P>
            </Row>
          );
        })}
      </VehiclesContainer>

      <PB>Toca para eliminar:</PB>
      {usados?.length > 0 ? null : (
        <P>La reparacion no tiene asociada insumos.</P>
      )}
      {usados?.map((usado) => {
        const ins = insumos.find((i) => i.Id === usado.Insumo);
        return (
          <P
            key={usado.Insumo}
            onPress={() => handleDelete(ins.Id)}
          >{`[${usado.Cantidad}] - ${ins?.Nombre}`}</P>
        );
      })}

      <Save onPress={() => navigation.navigate("Reparaciones")}>
        <P>Hecho</P>
      </Save>
    </Container>
  );
}
