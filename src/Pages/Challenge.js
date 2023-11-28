import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Audiorec from './Audiorec'

const Challenge = () => {
  return (
    <View style={styles.whiteBackground}>
      <Audiorec />
    </View>
  )
}

export default Challenge

const styles = StyleSheet.create({
  whiteBackground: {
    flex: 1,
    backgroundColor: 'white',
  },
})