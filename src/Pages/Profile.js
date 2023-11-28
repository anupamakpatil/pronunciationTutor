import { StyleSheet, Text, TouchableOpacity, View, Button, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Avatar, Title, Caption, TouchableRipple } from 'react-native-paper';
import Colors from '../Shared/Colors'
import { auth, db } from '../../firebase'
import { doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CommonActions } from '@react-navigation/native';


const Profile = () => {

  const navigation = useNavigation()
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

  const handleSignOut = () => {
    auth
        .signOut()
        .then(() => {
            navigation.replace("Login")
        })
        .catch(error => alert(error.message))
}

  const navigateToScreen = (screenName) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: screenName,
      })
    );
  };

  return (
    <SafeAreaView style={styles.whiteBackground}>
      {userData ? (
        <>
        
        <View style={styles.userInfoSection}>
          <View style={{flexDirection: 'row', marginTop: 15}}>
            <Avatar.Image 
            source={{
              uri: 'https://api.adorable.io/avatars/80/abott@adorable.png',
            }}
            size={80}
            />
            <View style={{marginLeft: 20}}>
              <Title style={[styles.title, {
                marginTop:15,
                marginBottom: 5,
                }]}>{userData.name}</Title>
                <Caption style={styles.caption}>{auth.currentUser?.email}</Caption>
            </View>
          </View>
        </View>

        <View style={styles.userInfoSection}>
          <View style={styles.row}>
            <Icon name="account" color="#777777" size={20}/>
            <Text style={{color:"#777777", marginLeft: 20}}>{userData.name}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="phone" color="#777777" size={20}/>
            <Text style={{color:"#777777", marginLeft: 20}}>{userData.mobile}</Text>
          </View>
          <View style={styles.row}>
            <Icon name="email" color="#777777" size={20}/>
            <Text style={{color:"#777777", marginLeft: 20}}>{auth.currentUser?.email}</Text>
          </View>
        </View>

        </>
      ) : (
        <Text>Loading...</Text>
      )}

      {/* <TouchableOpacity
      onPress={() => navigateToScreen('EditProfile')}
      style = {styles.button}>
        <Text style={{color: Colors.white}}>Edit Profile</Text>
      </TouchableOpacity> */}

      {/* <View style={styles.infoBoxWrapper}>
          <View style={[styles.infoBox, {
            borderRightColor: '#dddddd',
            borderRightWidth: 1
          }]}>
            <Title>₹140.50</Title>
            <Caption>Wallet</Caption>
          </View>
          <View style={styles.infoBox}>
            <Title>12</Title>
            <Caption>Orders</Caption>
          </View>
      </View> */}

      <TouchableOpacity onPress = {handleSignOut} style = {styles.button}>
        <Text style={{color: Colors.white}}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Profile

const styles = StyleSheet.create({
  whiteBackground: {
    flex: 1,
    backgroundColor: 'white',
  },

  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center' 
  },
  
  button: {
    backgroundColor: Colors.primary,
    width: '80%',
    padding: 10,
    margin: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
  },
  
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  
  infoBoxWrapper: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 100,
  },
  
  infoBox: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  menuWrapper: {
    marginTop: 10,
  },
  
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  
  menuItemText: {
    color: '#777777',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
})