import { View, Text,StatusBar } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';

const Feed = () => {
  return (<>
      {/* <StatusBar></StatusBar> */}
      <View>
        <Ionicons name="md-checkmark-circle" size={32} color="green" />
      </View>
  </>

  )
}

export default Feed