import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function IngredientsList({ data, deleteProduct }) {
  return (
    <View style={styles.container} useNativeDriver>
      <View>
        <Text>Produto: {data.name}</Text>
        <Text>Peso Usado: {data.weightUsed}g</Text>
        <Text>Valor da Embalagem: {data.value} R$</Text>
        <Text>Valor Usado: {data.valueUsed.toFixed(2)} R$</Text>
      </View>

      <TouchableOpacity
        onPress={() => {
          deleteProduct(data);
          console.log(data.key);
        }}
      >
        <MaterialIcons name="delete" size={30} color={"#121212"} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 7,
  },
});
