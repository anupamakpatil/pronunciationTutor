import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native'
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from 'react'
import { useNavigation } from "@react-navigation/core";
import { CommonActions } from "@react-navigation/native";
import { Audio } from "expo-av";
import * as Speech from 'expo-speech';
import Global from '../Shared/Global'
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../Shared/Colors'
import axios from "axios";
import { storage, auth, db } from "../../firebase";
import { doc, getDoc, setDoc, collection, updateDoc } from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { useRoute } from "@react-navigation/native";

const Reiterate = () => {

  const speak = (thingToSay) => {
    Speech.speak(thingToSay);
  };

  const navigation = useNavigation();

    const route = useRoute();
    const inputSentence = route.params?.input_sentence;
    console.log("input_sentence:", inputSentence);
    DisplayWord = inputSentence.split(' ')[0];
    const [word, setWord] = useState(DisplayWord);
    const [result, setResult] = useState('');
    const [recording, setRecording] = React.useState();
    const [recordings, setRecordings] = React.useState([]);
    const [message, setMessage] = React.useState("");

    // const result = await axios.get(
    //   `https://a6a5-34-90-47-193.ngrok.io/get_reiterate/${auth.currentUser.uid}`
    // );

    const updateRecentArray = async (missedWord) => {
      const docRef = doc(db, 'users', auth.currentUser.uid);
    
      try {
        const docSnapshot = await getDoc(docRef);
    
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const array = data?.recent || [];
    
          // Word to add or replace
          const newWord = missedWord;
    
          // Check if the word is already in the array
          if (!array.includes(newWord)) {
            // Add the new word to the end of the array (queue)
            array.push(newWord);
            if (array.length > 5) {
              const removedWord = array.shift();
              console.log("Removed Word:", removedWord);
            }
    
            // Update the document with the modified array
            await updateDoc(docRef, { recent: array });
            console.log("Updated Array (Queue):", array);
          } else {
            console.log(`${newWord} is already in the array`);
          }
        } else {
          console.log("Document does not exist");
        }
      } catch (error) {
        console.error("Error updating document:", error);
      }
    };    

    async function uploadAudioReiterate(uri, fileType) {
      try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const storageRef = ref(storage, "user_speech");
        uploadBytes(storageRef, blob).then((snapshot) => {
          console.log("Uploaded a blob or file!");
        });
  
        const nextItem = await axios.get(`${global.address}get_reiterate/${auth.currentUser.uid}`);
        console.log(nextItem.data.prompt);
        console.log(nextItem.data.status);
        setWord(nextItem.data.prompt);
        setResult(nextItem.data.status);

        if (nextItem.data.status === 'fail') {
          updateRecentArray(nextItem.data.prompt);
        }

        // const blah = nextItem.data.prompt;
        // const isWordExists = userData.recent.includes(nextItem.data.prompt);

        // if (isWordExists) {
        //   console.log(`${blah} already exists in the 'recent' array.`);
        // } else {
        //   console.log(`${blah} does not exist in the 'recent' array.`);
        // }
        setRecordings([]);
  
      } catch (err) {
        console.error("Failed to upload audio", err);
      }
    }


    async function startRecording() {
      try {
        const permission = await Audio.requestPermissionsAsync();
  
        if (permission.status === "granted") {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
          });
  
          const { recording } = await Audio.Recording.createAsync(
            Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
          );
  
          setRecording(recording);
        } else {
          setMessage("Please grant permission to app to access microphone");
        }
      } catch (err) {
        console.error("Failed to start recording", err);
      }
    }

    async function uploadReiterate() {
      try {
        const recordingToUpload = recordings[recordings.length - 1];
        const uri = recordingToUpload.file;
        const fileType = "audio/m4a";
        uploadAudioReiterate(uri, fileType);
  
      } catch (err) {
        console.error("Failed to upload recording", err);
      }
    }

    async function stopRecording() {
      setRecording(undefined);
      await recording.stopAndUnloadAsync();
  
      let updatedRecordings = [...recordings];
      const { sound, status } = await recording.createNewLoadedSoundAsync();
      updatedRecordings.push({
        sound: sound,
        duration: getDurationFormatted(status.durationMillis),
        file: recording.getURI(),
      });
  
      setRecordings(updatedRecordings);
    }

    function getDurationFormatted(millis) {
      const minutes = millis / 1000 / 60;
      const minutesDisplay = Math.floor(minutes);
      const seconds = Math.round((minutes - minutesDisplay) * 60);
      const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
      return `${minutesDisplay}:${secondsDisplay}`;
    }

    function getRecordingLines() {
      return recordings.map((recordingLine, index) => {
        return (
          <View key={index} style={styles.row}>
            <Text style={styles.fill}>
              Recording {index + 1} - {recordingLine.duration}
            </Text>
            <Button
              style={styles.button}
              onPress={() => recordingLine.sound.replayAsync()}
              title="Play"
            ></Button>
            <Button
              style={styles.button}
              onPress={() => setRecordings([])}
              title="Delete"
            ></Button>
          </View>
        );
      });
    }

    const navigateToScreen = () => {
      navigation.dispatch(
        CommonActions.navigate({
          name: 'Practicek',
        })
      );
  };

    useEffect(() => {
        const timer = setTimeout(() => {
          setResult('');
        }, 2000);

    
        return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }, [result]);


    const renderAnimation = () => {
        if (result === 'pass' || result === 'fail') {
            return (
                <View style={styles.overlay}>
                <Animatable.View
                  style={[
                    styles.animationContainer,
                    result === 'pass' ? styles.greenBackground : styles.redBackground,
                    styles.animationOverlay,
                  ]}
                  animation="fadeIn"
                  duration={2000} // Set duration to 2 seconds
                >
                  <Ionicons
                    name={result === 'pass' ? 'ios-checkmark-circle' : 'ios-close-circle'}
                    size={80}
                    color="#fff"
                  />
                  <View style={styles.messageContainer}>
                    <Text style={styles.messageText}>
                      {result === 'pass' ? 'Good Job!!' : 'Try Again!'}
                    </Text>
                  </View>
                </Animatable.View>
              </View>
            );
        } else if (result === 'eof') {
            return (
            <View style={styles.overlay}
            onLayout={() => {
              setTimeout(() => {
                navigateToScreen();
              }, 4000);
            }}>
              <Animatable.View
                style={[styles.animationContainer, styles.animationOverlay,]}
                animation="fadeIn"
                duration={2000}
              >
                <Ionicons
                  name={'ios-checkmark-circle'}
                  size={80}
                  color="#fff"
                />
                <View style={styles.messageContainer}>
                  <Text style={styles.messageText}>
                    {'Good Job!!'}
                  </Text>
                </View>
              </Animatable.View>
            </View>);
          } else {
            return null;
          }
        };

  return (
    <View style={styles.whiteBackground}>
    <View style={styles.container}>
        
        {renderAnimation()}   

              <View>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000' }}>Press the button to hear the word:</Text>
              <TouchableOpacity onPress={() => speak(word)}>
                <View style={{ padding: 10, alignItems: 'center' }}>
                  <Ionicons name="ios-play-circle" size={40} color={Colors.primary} />
                </View>
              </TouchableOpacity>
              </View> 
        
      <View style={styles.card}>
        <Text style={styles.title}>Here's your word:</Text>
        <Text style={styles.description}>{word}</Text>
      </View>

      <View>
      <Text>{message}</Text>
      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
        style={styles.button}
      />
      {getRecordingLines()}
      <TouchableOpacity title="Upload" onPress={uploadReiterate} style={styles.button}>
        <Ionicons name="ios-cloud-upload" color="white" size={26} />
        <Text style={styles.buttonText}>Upload</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>

    </View>
    </View>
  )
}

export default Reiterate

const styles = StyleSheet.create({
  whiteBackground: {
    flex: 1,
    backgroundColor: '#fff',
  },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
      overlay: {
        flexDirection: 'row',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
      },
      animationOverlay: {
        // flexDirection: 'row',
        // alignItems: 'center',
        // backgroundColor: 'transparent',
        zIndex: 2,
      },
      animationContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '70%',
        borderRadius: 8,
        padding: 35,
        height: 200,
      },
      animationText: {
        fontSize: 50,
        color: '#fff',
      },
      greenBackground: {
        backgroundColor: 'green',
      },
      redBackground: {
        backgroundColor: 'red',
      },
      messageContainer: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
      },
      messageText: {
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold',
      },
      row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      },
    
      fill: {
        flex: 1,
        margin: 16,
      },
      button: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 16,
        backgroundColor: Colors.primary, // Set the background color to match NormalPractice.js
        padding: 10,
        borderRadius: 5,
        color: '#fff',
      },
      buttonText: {
        color: 'white', // Set the text color to white
        fontWeight: 'bold',
        textAlign: 'center', // Center the text horizontally
        marginLeft: 10,
      },
})