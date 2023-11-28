import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Global from "../Shared/Global";
import { Audio } from "expo-av";
import * as Sharing from "expo-sharing";
import OverlayComponent from "./OverlayComponent";
import Colors from "../Shared/Colors";
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import { storage, auth, db } from "../../firebase";
import { doc, getDoc, setDoc, collection, updateDoc } from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";

const Audiorec = ({input_sentence}) => {
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [score, setScore] = useState(null); 
  const [showOverlay, setShowOverlay] = useState(false);

  async function uploadAudio(uri, fileType) {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const storageRef = ref(storage, "user_speech");
      // const storageRef = ref(storage, `users/${auth.currentUser.uid}/audio/${Date.now()}.${fileType}`);
      // const uploadTask = uploadBytes(storageRef, blob);
      uploadBytes(storageRef, blob).then((snapshot) => {
        console.log("Uploaded a blob or file!");
      });

      const uploadedScore = await axios.get(`${global.address}get_score`);
      console.log(uploadedScore.data.prompt);
      setScore(uploadedScore.data.prompt);
      const docRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(docRef, { lastscore: score });
      setShowOverlay(true);

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

  async function uploadRecording() {
    try {
      const recordingToUpload = recordings[0];
      const uri = recordingToUpload.file;
      const fileType = "audio/m4a";
      uploadAudio(uri, fileType);

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

  return (
    <View>
      <Text>{message}</Text>
      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
        style={styles.button}
      />
      {getRecordingLines()}
      <TouchableOpacity title="Upload" onPress={uploadRecording} style={styles.button}>
        <Ionicons name="ios-cloud-upload" color="white" size={26} />
        <Text style={styles.buttonText}>Upload</Text>
      </TouchableOpacity>

      <OverlayComponent input_sentence={input_sentence} isVisible={showOverlay} score={score} setShowOverlay={setShowOverlay}/>
      <StatusBar style="auto" />
    </View>
  );
};

export default Audiorec;

const styles = StyleSheet.create({
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
});