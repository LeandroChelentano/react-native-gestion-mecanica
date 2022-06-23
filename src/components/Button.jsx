import React from "react";
import styled from "styled-components/native";

const Outter = styled.TouchableHighlight`
  border: 1px solid #111;
  width: 80%;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  border-radius: 5px;
`;

const Inner = styled.Text`
  color: #111;
  font-size: 20px;
`;

export default function Button({ children, path, options, navigation }) {
  const params = options === undefined ? {} : options;

  return (
    <Outter onPress={() => navigation.navigate(path, params)}>
      <Inner>{children}</Inner>
    </Outter>
  );
}
