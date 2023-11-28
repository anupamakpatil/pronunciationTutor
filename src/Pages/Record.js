import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Audiorec from './Audiorec';

const Record = ({ route }) => {
  const { variable } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Record Page</Text>
      <View style={styles.card}>
        <Text style={styles.title}>Here's your sentence:</Text>
        <Text style={styles.description}>{variable}</Text>
      </View>

      <View>
        <Audiorec />
      </View>

    </View>
  );
};

export default Record;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
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
