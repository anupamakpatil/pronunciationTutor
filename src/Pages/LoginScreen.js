import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, Image, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/core';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Colors from '../Shared/Colors'
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../firebase'

export default function LoginScreen({}) {
    const windowWidth = Dimensions.get('window').width;

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if(user) {
                navigation.replace('BottomNav')
            }
        })

        return unsubscribe;
    }, [])

    function navi(){
        navigation.replace('Signup');
    }

    const handleLogin = () => {
        auth
            .signInWithEmailAndPassword(email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log('Logged in with:', user.email);
            })
            .catch(error => alert(error.message))
    }

  return (
    <KeyboardAwareScrollView style={[styles.container, styles.whiteBackground]}>
        <Image source={require('../Assets/Images/login.png')} style={{width: windowWidth }} />

      <View style={styles.container}>
            <Text style={styles.welcomeText}>Welcome to{'\n'}*Name*</Text>
            <Text style={{textAlign: 'center', marginTop: 45, fontSize: 25}} >Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCompleteType="email"
                value={email}
                onChangeText={text=>setEmail(text)}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                autoCapitalize="none"
                autoCompleteType="password"
                value={password}
                onChangeText={text=>setPassword(text)}
            />

            <TouchableOpacity 
                onPress={handleLogin }
                style={styles.button}>
                <Text style={{color: Colors.white}}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={navi}
                style={styles.signUpLink}>
                <Text style={{color: Colors.primary}}>New User? Sign Up</Text>
            </TouchableOpacity>

            {/* <View style={styles.horizontalLineContainer}>
                <View style={styles.horizontalLine} />
                <Text style={styles.orText}>OR</Text>
                <View style={styles.horizontalLine} />
            </View>

            <TouchableOpacity style={styles.button} >
                <Ionicons name="logo-google" size={24} color="white" style={{marginRight: 10}}/>
                <Text style={{color: Colors.white}}>Sign In with Google</Text>
            </TouchableOpacity> */}

        </View>
        
    </KeyboardAwareScrollView>
  )
}



const styles = StyleSheet.create({

    whiteBackground: {
        flex: 1,
        backgroundColor: 'white',
    },

    container: {
        flex: 1,
        paddingTop: 50,
        marginTop: -25 ,
        backgroundColor: '#fff',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
    },

    welcomeText: {
        fontSize: 35,
        textAlign: 'center',
        fontWeight: 'bold'
    },

    button: {
        backgroundColor: Colors.primary,
        padding: 10,
        margin: 30,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },

    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        margin: 10,
        paddingLeft: 10,
    },

    horizontalLineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15,
    },

    horizontalLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'gray',
        marginLeft: 10,
        marginRight: 10,
    },

    orText: {
        color: 'gray',
        fontWeight: 'bold',
        fontSize: 16,
    },

    signUpLink: {
        alignItems: 'center',
        marginBottom: 30,
    },
})