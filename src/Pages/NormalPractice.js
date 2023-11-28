import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import Audiorec from "./Audiorec";
import { useRoute } from "@react-navigation/native";

const NormalPractice = () => {
  const route = useRoute();
  const responseData = route.params?.responseData;

  useEffect(() => {
    console.log("responseData:", responseData);
  }, [responseData]);

  const sentence = responseData?.prompt;

  return (
    <View style={styles.whiteBackground}>

      <View style={styles.card}>
        <Text style={styles.title}>Here's your sentence:</Text>
        <Text style={styles.description}>{sentence}</Text>
      </View>

      <View>
        <Audiorec input_sentence={sentence}/>
      </View>

    </View>
  );
};

export default NormalPractice;

const styles = StyleSheet.create({
  whiteBackground: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#3498db',
    borderRadius: 10,
    padding: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#fff',
  },
});