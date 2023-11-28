// OverlayComponent.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { useNavigation } from "@react-navigation/core";
import { CommonActions } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc, collection, updateDoc } from 'firebase/firestore';

const OverlayComponent = ({ input_sentence, isVisible, score, setShowOverlay }) => {

    const navigation = useNavigation();

    const updateScoreArray = async (newScore) => {
      const docRef = doc(db, 'users', auth.currentUser.uid);
    
      try {
        const docSnapshot = await getDoc(docRef);
    
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const array = data?.scorearray || [];
    
          // Word to add or replace
          const news = newScore;
        
            
            array.push(news);
            if (array.length > 5) {
              const removedWord = array.shift();
              console.log("Removed Word:", removedWord);
            }
    
            // Update the document with the modified array
            await updateDoc(docRef, { scorearray: array });
            await updateDoc(docRef, { lastscore: newScore});
            console.log("Updated Array (Queue):", array);
          
        } else {
          console.log("Document does not exist");
        }
      } catch (error) {
        console.error("Error updating document:", error);
      }
    };    

    const navigateToScreen = (screenName, score) => {
      updateScoreArray(score);
        navigation.dispatch(
          CommonActions.navigate({
            name: screenName,
          })
        );
        
        setShowOverlay(false);
    };

    const navigateToReiterate = async (screenName, score) => {
      try {
        updateScoreArray(score);
        // requestParams = {"parameters": queryParams};
        //string_params=queryParams.toString();
        
        // console.log(JSON.parse(result.request._response));
        // Navigate to the specified screen and pass the response data as a parameter
        navigation.dispatch(
          CommonActions.navigate({
            name: screenName,
            params: {
              input_sentence: input_sentence,
            }

          })
        );
        
        setShowOverlay(false);
      } catch (error) {
        console.error("Error:", error);
      }
    };


  return (
    <Modal isVisible={isVisible}>

      <View style={styles.overlayContainer}>

        <Ionicons name="ios-ribbon" size={50} />
        <Text style={styles.scoreText}>{`Score: ${score}`}</Text>

        <View style={{paddingTop: 20}}>
        <TouchableOpacity style={[styles.button]} onPress={() => navigateToReiterate("Reiterate", score)}>
          <Text style={styles.buttonText}>Reiterate</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigateToScreen("Practicek", score)}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        </View>

      </View>

    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    height: 330,
  },
  scoreText: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    width: 150,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default OverlayComponent;