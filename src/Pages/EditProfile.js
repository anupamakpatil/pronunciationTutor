import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'

const EditProfile = () => {
  return (
    <View style={styles.container}>
      {/* <TouchableOpacity onPress={pickImage}>
        <Image style={styles.profilePicture} source={{ uri: editedUser.profilePicture }} />
      </TouchableOpacity> */}

      {/* <TextInput
        style={styles.input}
        placeholder="Name"
        value={editedUser.name}
        onChangeText={(text) => setEditedUser({ ...editedUser, name: text })}
      /> */}
      {/* <TextInput
        style={styles.input}
        placeholder="Email"
        value={editedUser.email}
        onChangeText={(text) => setEditedUser({ ...editedUser, email: text })}
      /> */}
      {/* <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={editedUser.phoneNumber}
        onChangeText={(text) => setEditedUser({ ...editedUser, phoneNumber: text })}
      /> */}

      {/* <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity> */}
    </View>
  )
}

export default EditProfile

const styles = StyleSheet.create({})