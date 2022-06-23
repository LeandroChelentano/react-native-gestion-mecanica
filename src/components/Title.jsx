import React from "react";
import styled from "styled-components/native";

const Text = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: black;
  margin-top: 10px;
`;

export default function Title({ children }) {
  return <Text>{children}</Text>;
}
