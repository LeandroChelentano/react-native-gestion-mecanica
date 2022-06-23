import React from "react";
import styled from "styled-components/native";

const Text = styled.Text`
  font-size: 18px;
  color: gray;
`;

export default function Subtitle({ children }) {
  return <Text>{children}</Text>;
}
