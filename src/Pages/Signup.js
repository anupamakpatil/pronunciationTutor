import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, Image, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useNavigation } from '@react-navigation/core';
import Colors from '../Shared/Colors'
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../firebase'
import { doc, setDoc, collection } from 'firebase/firestore';

const SignUp = () => {
    const windowWidth = Dimensions.get('window').width;

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [mobile, setMobile] = useState('')
    const [password, setPassword] = useState('')
    const [passwords, setPasswords] = useState('')

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
        navigation.replace('Login');
    }

    const handleSignUp = () => {
        auth
            .createUserWithEmailAndPassword(email, password)
            .then(async (userCredentials) => {
                const user = userCredentials.user;
                console.log('Registered with:', user.email);

                const userData = {
                    name: name,
                    email: email,
                    mobile: mobile,
                    recent: ['Anyway', 'Tenet', 'Electoral', 'Hyperbole', 'Segue'],
                    lastscore: 0,
                    scorearray: [],
                }

                const usersCollectionRef = collection(db, 'users');
                await setDoc(doc(usersCollectionRef, user.uid), userData);

                console.log('User data added to Firestore!');
            })
            .catch(error => alert(error.message))
    }

    const validateForm = () => {
        var form_inputs = [name, email, mobile, password, passwords];
        var passwword_match = (password == passwords);
        const startsWith789 = (input) => /^[789]/.test(input);
        const isNumeric = (input) => /^[0-9]+$/.test(input);

        if(form_inputs.includes('')){
            return console.log('Please fill all the fields');
        }

        else if (!isNumeric(mobile) || mobile.length != 10 || !startsWith789(mobile)) {
            return console.log('Enter a valid phone number');
        }

        else if(!passwword_match){
            return console.log('Passwords do not match');
        }

        else return handleSignUp();
    }

  return (
    <KeyboardAwareScrollView style={styles.whiteBackground}>
        <Image source={require('../Assets/Images/login.png')} style={{width: windowWidth }} />

      <View style={styles.container}>
            <Text style={styles.welcomeText}>Welcome to *Name*</Text>
            <Text style={{textAlign: 'center', marginTop: 20, fontSize: 25}} >Signup</Text>

            <TextInput
                style={styles.input}
                placeholder="Full Name"
                keyboardType="default"
                autoCapitalize="words"
                autoCompleteType="name"
                value={name}
                onChangeText={text=>setName(text)}
            />

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
                placeholder="Mobile"
                keyboardType="phone-pad"
                autoCompleteType="tel"
                value={mobile}
                onChangeText={text=>setMobile(text)}
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

            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                autoCapitalize="none"
                autoCompleteType="password"
                value={passwords}
                onChangeText={text=>setPasswords(text)}
            />

            <TouchableOpacity 
                onPress={validateForm}
                style={styles.button}>
                <Text style={{color: Colors.white}}>Signup</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={navi}
                style={styles.signUpLink}>
                <Text style={{color: Colors.primary}}>Already a User? Login</Text>
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

export default SignUp

const styles = StyleSheet.create({

    whiteBackground: {
        flex: 1,
        backgroundColor: 'white',
    },

    container: {
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