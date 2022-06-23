import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./src/screens/Home";

import Clients from "./src/screens/clientes/Clients";
import AddClient from "./src/screens/clientes/AddClient";
import SpecificClient from "./src/screens/clientes/SpecificClient";
import EditClient from "./src/screens/clientes/EditClient";

import Vehicles from "./src/screens/vehiculos/Vehicles";
import AddVehicle from "./src/screens/vehiculos/AddVehicle";
import SpecificVehicle from "./src/screens/vehiculos/SpecificVehicle";
import EditVehicle from "./src/screens/vehiculos/EditVehicle";

import Treatments from "./src/screens/tratamientos/Treatments";
import AddTreatment from "./src/screens/tratamientos/AddTreatment";
import SpecificTreatment from "./src/screens/tratamientos/SpecificTreatment";

import { ClientsContext } from "./src/components/ClientsContext";

import { db } from "./src/db/Queries";

const Stack = createNativeStackNavigator();

export default function App() {
  const [clientes, setClientes] = useState(null);
  const [vehiculos, setVehiculos] = useState(null);
  const [reparaciones, setReparaciones] = useState(null);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM Clientes`,
        [],
        (_, result) => {
          if (result.rows.length > 0) {
            var temp = [];
            for (let i = 0; i < result.rows.length; ++i)
              temp.push(result.rows.item(i));
            setClientes(temp);
          } else {
            setClientes([]);
          }
        },
        (_, error) => {
          console.log(error);
        }
      );
    });
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM Vehiculos`,
        [],
        (_, result) => {
          if (result.rows.length > 0) {
            var temp = [];
            for (let i = 0; i < result.rows.length; ++i)
              temp.push(result.rows.item(i));
            setVehiculos(temp);
          } else {
            setVehiculos([]);
          }
        },
        (_, error) => {
          console.log(error);
        }
      );
    });
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM Tratamientos`,
        [],
        (_, result) => {
          if (result.rows.length > 0) {
            var temp = [];
            for (let i = 0; i < result.rows.length; ++i)
              temp.push(result.rows.item(i));
            setReparaciones(temp);
          } else {
            setReparaciones([]);
          }
        },
        (_, error) => {
          console.log(error);
        }
      );
    });
  }, []);

  return (
    <ClientsContext.Provider
      value={{
        clientes,
        setClientes,
        vehiculos,
        setVehiculos,
        reparaciones,
        setReparaciones,
      }}
    >
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Inicio">
          <Stack.Screen name="Inicio" component={Home} />
          <Stack.Screen name="Clientes" component={Clients} />
          <Stack.Screen name="Cliente" component={SpecificClient} />
          <Stack.Screen name="Nuevo Cliente" component={AddClient} />
          <Stack.Screen name="Editar Cliente" component={EditClient} />

          <Stack.Screen name="Vehiculos" component={Vehicles} />
          <Stack.Screen name="Vehiculo" component={SpecificVehicle} />
          <Stack.Screen name="Nuevo Vehiculo" component={AddVehicle} />
          <Stack.Screen name="Editar Vehiculo" component={EditVehicle} />

          <Stack.Screen name="Reparaciones" component={Treatments} />
          <Stack.Screen name="Reparacion" component={SpecificTreatment} />
          <Stack.Screen name="Nueva Reparacion" component={AddTreatment} />
        </Stack.Navigator>
      </NavigationContainer>
    </ClientsContext.Provider>
  );
}
