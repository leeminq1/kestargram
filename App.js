import { StatusBar } from 'expo-status-bar';
import React,{useState,useEffect}from 'react';
import { StyleSheet, Text, View,Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Landing from './components/auth/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Main from './components/Main';

// firebase
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged} from "firebase/auth";

// redux
import { Provider } from 'react-redux'
import { createStore,applyMiddleware } from 'redux';
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'

// store
const store=createStore(rootReducer,applyMiddleware(thunk))

const firebaseConfig = {
  apiKey: "AIzaSyCznPHHallePLgBPV--4YbUW64dfaoVhRI",
  authDomain: "kestargram.firebaseapp.com",
  projectId: "kestargram",
  storageBucket: "kestargram.appspot.com",
  messagingSenderId: "897651258922",
  appId: "1:897651258922:web:9dc9446f41d0fcae0b7553",
  measurementId: "G-LJ5BCZ87DR"
};

initializeApp(firebaseConfig)

const Stack=createStackNavigator();

export default function App() {
  const [loaded,setLoaded]=useState(true)
  const [loading,setloading]=useState(false)

  const auth = getAuth();

  const chkSigned = async ()=>{
    await onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        setloading(true)
        setLoaded(false)
        // ...
      } else {
        console.log("로그인 안됨")
        setloading(false)
        setLoaded(false)
      }
    })

  };

  useEffect(()=>{
    chkSigned();
  },[])

  if (loaded){
    return(
      <View style={{flex:1,justifyContent:"center"}}>
        <Text>Loading...</Text>
     </View>
    )
  }

  return (loading?
  <Provider store={store}>
    <Main></Main>
  </Provider>:
  <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen name="Lading" component={Landing} options={{headerShown:false}}></Stack.Screen>
        <Stack.Screen name="Register" component={Register} options={{headerShown:false}}></Stack.Screen>
        <Stack.Screen name="Login" component={Login} options={{headerShown:false}}></Stack.Screen>
      </Stack.Navigator>
  </NavigationContainer>
  );
}


