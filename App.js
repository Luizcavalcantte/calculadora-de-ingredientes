import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  StatusBar,
} from "react-native";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./src/styles/styles";
import IngredientsList from "./src/components/IngredientsList";

export default function App() {
  const [openModal, setOpenModal] = useState(false);

  const [ingredientInput, setIngredientInput] = useState("");
  const [productWeightInput, setProductWeightInput] = useState("");
  const [weightUsedInput, setWeightUsedInput] = useState("");
  const [productValueInput, setProductValueInput] = useState("");

  const [products, setProducts] = useState([]);

  function addProduct() {
    const product = {
      key: ingredientInput,
      name: ingredientInput,
      totalWeight: productWeightInput,
      weightUsed: weightUsedInput,
      value: productValueInput,
      valueUsed: (weightUsedInput * productValueInput) / productWeightInput,
    };
    setProducts([...products, product]);
    setOpenModal(false);

    setIngredientInput("");
    setProductWeightInput("");
    setWeightUsedInput("");
    setProductValueInput("");

    console.log(products);
  }

  const deleteProduct = useCallback((data) => {
    const find = products.filter((product) => product.key !== data.key);

    Alert.alert("Deseja apagar este produto?", "", [
      {
        text: "Sim",
        onPress: () => {
          setProducts(find);
        },
      },
      { text: "Não" },
    ]);
  });

  function deleteAllProducts() {
    Alert.alert("Confirmação", "deseja apagar todos os produtos?", [
      { text: "Sim", onPress: () => setProducts([]) },
      { text: "Não" },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#0d1117" />
      <MaterialCommunityIcons
        onPress={deleteAllProducts}
        style={styles.btnDeleteAllProducts}
        name="delete-forever-outline"
        size={35}
        color="#f63737"
      />
      <View>
        <Text style={styles.title}>Meus ingredientes</Text>
      </View>
      <TouchableOpacity
        style={styles.btnOpenModal}
        onPress={() => {
          setOpenModal(true);
        }}
      >
        <AntDesign name="plus" size={24} color="#fff" />
      </TouchableOpacity>
      <FlatList
        showsHorizontalScrollIndicator="false"
        data={products}
        // keyExtractor precisa receber o dado em forma de string
        keyExtractor={(item) => String(item.key)}
        //as chaves no {item} desconstroi o arrey, retornando um obj de cada vez,
        //obs caso colocar mais de uma ação dentro da function q retorna o componente, tem q usar o RETURN
        renderItem={({ item }) => (
          <IngredientsList data={item} deleteProduct={deleteProduct} />
        )}
        //essa propriedade handleDelete vai ser usada como referenica la no TaskList pra podermos usar nossa função
      />
      <Modal animationType="slide" visible={openModal}>
        <SafeAreaView style={styles.container}>
          <TouchableOpacity
            onPress={() => setOpenModal(false)}
            style={styles.modalBtnBack}
          >
            <Ionicons name="md-arrow-back" size={40} color="#fff" />
          </TouchableOpacity>

          <View>
            <Text style={styles.title}>Novo Produto</Text>
          </View>
          <View useNativeDriver style={{ alignItems: "center" }}>
            <View>
              <TextInput
                value={ingredientInput}
                style={styles.inputs}
                placeholderTextColor="#747474"
                autoCorrect={false}
                placeholder="Ingrediente"
                onChangeText={(text) => setIngredientInput(text)}
              />
              <TextInput
                value={productWeightInput}
                keyboardType="numeric"
                style={styles.inputs}
                placeholderTextColor="#747474"
                autoCorrect={false}
                placeholder="Peso da Embalagem (g)"
                onChangeText={(text) => setProductWeightInput(text)}
              />
              <TextInput
                value={weightUsedInput}
                keyboardType="numeric"
                style={styles.inputs}
                placeholderTextColor="#747474"
                autoCorrect={false}
                placeholder="Peso Usado (g)"
                onChangeText={(text) => setWeightUsedInput(text)}
              />
              <TextInput
                value={productValueInput}
                keyboardType="numeric"
                style={styles.inputs}
                placeholderTextColor="#747474"
                autoCorrect={false}
                placeholder="Valor do Produto"
                onChangeText={(text) => setProductValueInput(text)}
              />
            </View>

            <TouchableOpacity style={styles.btnAddProduct} onPress={addProduct}>
              <Text style={styles.textAddProduct}>Adicionar Produto</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
      <View style={styles.total}>
        <Text>Total = Valor</Text>
      </View>
    </SafeAreaView>
  );
}
