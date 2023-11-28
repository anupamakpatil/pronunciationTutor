import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Avatar, Title, Caption, TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, db } from '../../firebase'
import { doc, getDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import CircleAnimation from './CircleAnimation';
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const Home = ({navigation}) => {

  const screenWidth = Dimensions.get("window").width;

  const [userData, setUserData] = useState(null);
  const [data, setData] = useState({
    // labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        data: [45, 57, 76, 9, 65],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ["Recent scores"],
  });

const fetchUserData = async () => {
  const userDocRef = doc(db, 'users', auth.currentUser.uid);

  try {
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      setUserData(userDocSnapshot.data());
      // setData((prevData) => ({
      //   ...prevData,
      //   datasets: [
      //     {
      //       ...prevData.datasets[0],
      //       data: userDocSnapshot.data().scorearray || [], // Assuming scorearray is an array in userData
      //     },
      //   ],
      // }));

      setData((prevData) => ({
        ...prevData,
        datasets: [
          {
            ...prevData.datasets[0],
            data: [0, ...userDocSnapshot.data().scorearray] || [], // Prepend 0 to the array
          },
        ],
      }));
    } else {
      console.log('User does not exist in the database!');
    }
  } catch (error) {
    console.error(error);
  }
};


useFocusEffect(
  React.useCallback(() => {
    fetchUserData();
    
  }, [])
);

const chartConfig = {
  // backgroundGradientFrom: "#1E2923",
  // backgroundGradientFromOpacity: 0,
  // backgroundGradientTo: "#08130D",
  // backgroundGradientToOpacity: 0.5,
  // color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  // strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  // useShadowColorFromDataset: false, // optional

  // backgroundGradientFrom: "#FFFFFF", // White
  // backgroundGradientFromOpacity: 1,
  // backgroundGradientTo: "#FFFFFF", // White
  // backgroundGradientToOpacity: 1,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White
  decimalPlaces: 0,
  fromZero: true,
  yAxisMin: 0,
  yAxisInterval: 1,
  yAxisLabel: (value) => value.toFixed(0),
  // yAxisSuffix: '', // Empty string to prevent the y-axis label from showing a suffix
  // yAxisInterval: 1,
};
  

  return (
    <View style={styles.whiteBackground}>
      <View>
            {userData ? (
        <>

      <View style={[styles.card, {backgroundColor: '#de305d'}]}>
        <Text style={styles.title}>Welcome, {userData.name} !!</Text>
        <LineChart data={data} width={330} height={220} chartConfig={chartConfig} />      
      </View>



        <View style={styles.userInfoSection}>

          <View style={[styles.card, {backgroundColor: '#05869c', width: "44%", aspectRatio: 0.75}]}>
            <Text style={styles.title}>Recent errors</Text>
            {userData.recent.slice().reverse().map((word, index) => (
            <Text key={index} style={styles.description}>{index+1}. {word}</Text>
            ))}
          </View>

          <View style={[styles.card, {backgroundColor: '#27262b', width: "44%", aspectRatio: 0.75, justifyContent: 'center', alignItems: 'center'}]}>
            <Text style={styles.title}>Recent score</Text>
            <Text style={[styles.description ]}>{userData.lastscore}</Text>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 5, paddingTop: 5 }}>
              <CircleAnimation score={userData.lastscore} />
            </View>
          </View>

        </View>

        </>
      ) : (
        <Text>Loading...</Text>
      )}
      </View>
      
    </View>
  )
}

export default Home

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
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  description: {
    fontSize: 17.8,
    color: '#fff',
  },
  userInfoSection: {
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#fff",
    paddingTop: 30,
    flexDirection: "row",
    flexWrap: "wrap",
  },
})