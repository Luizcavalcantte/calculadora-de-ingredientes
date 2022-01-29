import React, { useState, useCallback, useEffect } from "react";
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

  const [totalUsed, setTotalUsed] = useState("");
  const [weightTotalUsed, setWeightTotalUsed] = useState("");

  useEffect(() => {
    async function loadIngredients() {
      const ingredientsStorag = await AsyncStorage.getItem("ingredients");

      if (ingredientsStorag) {
        setProducts(JSON.parse(ingredientsStorag));
      }
    }
    loadIngredients();
  }, []);

  useEffect(() => {
    async function saveIngredients() {
      await AsyncStorage.setItem("ingredients", JSON.stringify(products));
    }
    saveIngredients();
  }, [products]);

  useEffect(() => {
    setTotalUsed(
      products
        //reduce funciona da seguinte maneira: recebe uma function que precisa de dois parametros(valor inicial que vai acomular o resultado , o item a ser processado)=> valorInicial + products.valueUsed, o valor q iniciaremos no nosso acomulador
        .reduce((initialVal, products) => initialVal + products.valueUsed, 0)
        .toFixed(2)
    );
    setWeightTotalUsed(
      products
        //reduce funciona da seguinte maneira: recebe uma function que precisa de dois parametros(valor inicial que vai acomular o resultado , o item a ser processado)=> valorInicial + products.valueUsed, o valor q iniciaremos no nosso acomulador
        .reduce(
          (initialVal, products) =>
            initialVal + parseFloat(products.weightUsed),
          0
        )
    );
  }, [products]);

  function addProduct() {
    if (
      ingredientInput !== "" &&
      productWeightInput !== "" &&
      weightUsedInput !== "" &&
      productValueInput !== ""
    ) {
      const product = {
        key: ingredientInput,
        name: ingredientInput,
        totalWeight: productWeightInput,
        weightUsed: weightUsedInput,
        //.replace(valor esperado indesejado , valor desejado)
        value: productValueInput.replace(",", "."),
        valueUsed:
          (weightUsedInput * productValueInput.replace(",", ".")) /
          productWeightInput,
      };
      setProducts([...products, product]);
      setOpenModal(false);

      setIngredientInput("");
      setProductWeightInput("");
      setWeightUsedInput("");
      setProductValueInput("");
    } else {
      Alert.alert("Todos os campos precisam estar preenchidos");
    }
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
      <StatusBar barStyle="dark-content" backgroundColor="#00a884" />
      <View
        style={{
          backgroundColor: "#00a884",
          width: "100%",
          height: 50,
          alignItems: "center",
        }}
      >
        <Text style={styles.title}>Meus ingredientes</Text>
        <MaterialCommunityIcons
          onPress={deleteAllProducts}
          style={styles.btnDeleteAllProducts}
          name="delete-forever-outline"
          size={35}
          color="#ff7d7d"
        />
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
        contentContainerStyle={{ paddingBottom: 70 }}
        showsVerticalScrollIndicator={false}
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
          <View
            style={{
              backgroundColor: "#00a884",
              width: "100%",
              height: 50,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => setOpenModal(false)}
              style={styles.modalBtnBack}
            >
              <Ionicons name="md-arrow-back" size={40} color="#fff" />
            </TouchableOpacity>
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
                placeholder="Valor do Produto (R$)"
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
        <Text>Total = {totalUsed}R$</Text>
        <Text>Peso Aproximado = {weightTotalUsed}g</Text>
      </View>
    </SafeAreaView>
  );
}
