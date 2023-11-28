import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
// import Audiorec from './Audiorec';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import axios from 'axios';

const CustomPractice = () => {

  const [enteredWord, setEnteredWord] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigation = useNavigation();

  const handleEnterButtonPress = async (screenName, enteredWord) => {
    try {
      console.log(`${global.address}get_custom_prompt/${enteredWord}`);
      const nextsentence = await axios.get(`${global.address}get_custom_prompt/${enteredWord}`);
      console.log(nextsentence.data);
      if(nextsentence.data.prompt != 'fail'){
      navigation.dispatch(
        CommonActions.navigate({
          name: screenName,
          params: {
            responseData: nextsentence.data,
          },

        })
      );
      } else {
        setErrorMessage('Please enter a valid word');
      }

    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <View style={styles.whiteBackground}>
    <View style={styles.container}>
   
      <Text style={styles.instructionText}>Enter a word:</Text>
      <TextInput
        style={[styles.input]}
        placeholder="Type here..."
        value={enteredWord}
        onChangeText={(text) => setEnteredWord(text)}
      />
      <TouchableOpacity
        style={styles.enterButton}
        onPress={() => handleEnterButtonPress("PracticeScreen", enteredWord)}
      >
        <Text style={styles.buttonText}>Get your sentence</Text>
      </TouchableOpacity>

      {errorMessage ? (
        <Text style={{ color: 'red' }}>{errorMessage}</Text>
      ) : null}

    </View>
    </View>

  );

}

export default CustomPractice

const styles = StyleSheet.create({
  whiteBackground: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  instructionText: {
    fontSize: 18,
    // color: 'white',
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  invalidInput: {
    borderColor: 'red',
  },
  enterButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
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
})