import { FlatList } from "react-native-gesture-handler";
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AppSaveView from "./../../components/views/AppSaveView";
import HomeHeader from "../../components/headers/HomeHeader";
import { AppFonts } from "../../styles/fonts";
import ProductCard from "../../components/cards/ProductCard";
import { FOOD_DATA } from "../../data/products";
import { s, vs } from "react-native-size-matters";

const HomeScreen = () => {
  return (
    <AppSaveView>
      <HomeHeader />
      <FlatList
        numColumns={2}
        data={FOOD_DATA}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard
            imageURL={item.imageURL}
            title={item.title}
            price={item.price}
            onAddToCartPress={() => {}}
          />
        )}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: vs(10),
        }}
        contentContainerStyle={{
          paddingHorizontal: s(10),
        }}
      />
    </AppSaveView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
