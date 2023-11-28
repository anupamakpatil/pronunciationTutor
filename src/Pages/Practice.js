import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import Colors from "../Shared/Colors";
import { CommonActions } from "@react-navigation/native";
import { auth, db } from '../../firebase'
import { doc, getDoc } from 'firebase/firestore';
import axios from "axios";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';


const Practice = () => {
  const windowWidth = Dimensions.get('window').width;
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);

      try {
        const userDocSnapshot = await getDoc(userDocRef);

        if(userDocSnapshot.exists()) {
          setUserData(userDocSnapshot.data());
        }
        else {
          console.log('User does not exist in database!');
        }
      }

      catch(error) {
        console.log(error);
      }
    };

    fetchUserData();

  },[]);

  const navigateToScreen = (screenName) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: screenName,
      })
    );
  };
  
  const navigateToPractice = async (screenName) => {
    try {
      const response = await axios.get(
        `${global.address}get_prompt`
      );

      // Navigate to the specified screen and pass the response data as a parameter
      navigation.dispatch(
        CommonActions.navigate({
          name: screenName,
          params: {
            responseData: response.data, // Pass the response data as a parameter
          },
        })
      );
    } catch (error) {
      console.error("Error:", error.response.data);
    }
  };

  const handleEnterButtonPress = async (screenName) => {
    try {
      const randomIndex = Math.floor(Math.random() * userData.recent.length);
      const enteredWord = userData.recent[randomIndex];
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
      }

    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <View style={styles.whiteBackground}>

      {/* <LinearGradient colors={['#65dfc9', '#6cdbeb']} style={{ flex: 1 }}>

      <LinearGradient colors={['rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 0.3)']} style={{ flex: 1 }}> */}

<Image source={require('../Assets/Images/practice.jpg')} style={{width: windowWidth, height: 220 }} />

      <View style={styles.container}>
        <Text style={{ textAlign: "center", fontSize: 25 }}>
          Select Your Method Of Practice
        </Text>
      </View>

      <View style={styles.container}>

        <TouchableOpacity
        style={[styles.learnButton, {width:"90%", backgroundColor: '#de305d' }]}
          onPress={() => navigateToPractice("PracticeScreen")}
        >
          <Text style={[styles.buttonText, ]}>Practice</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.learnButton}
          onPress={() => navigateToScreen("FreePractice")}
        >
          <Text style={styles.buttonText}>Free Practice</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={[styles.learnButton, {  aspectRatio: 1.1, backgroundColor: '#05869c' }]}
          onPress={() => navigateToScreen("CustomWordPractice")}
        >
          <Text style={styles.buttonText}>Custom Word Practice</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.learnButton, { aspectRatio: 1.1, backgroundColor: '#27262b' }]}
          onPress={() => handleEnterButtonPress("PracticeScreen")}
        >
          <Text style={styles.buttonText}>User Specific Practice</Text>
        </TouchableOpacity>
      </View>

      {/* </LinearGradient>
      </LinearGradient> */}
    </View>

  );
};

export default Practice;

const styles = StyleSheet.create({
  whiteBackground: {
    flex: 1,
    backgroundColor: '#fff',
  },

  container: {
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#fff",
    paddingTop: 30,
    flexDirection: "row",
    flexWrap: "wrap",
  },

  headingText: {
    fontSize: 35,
    textAlign: "center",
    fontWeight: "bold",
  },

  learnButton: {
    padding: 20,
    marginVertical: 15,
    width: "45%",
    height: "45%",
    alignSelf: "center",
    borderRadius: 15,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginHorizontal: '2%',
  },

  buttonText: {
    color: Colors.white,
    fontSize: 25,
  },
});
