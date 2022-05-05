import React,{useState,useEffect}from 'react';
import { StyleSheet, Text, View,Button,LogBox,StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Landing from './components/auth/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Main from './components/Main';
import Add from './components/main/Add';
import Comment from './components/main/Comment';

// firebase
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged} from "firebase/auth";

// redux
import { Provider } from 'react-redux'
import { createStore,applyMiddleware } from 'redux';
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'
import Save from './components/main/Save';

// Firebase sets some timeers for a long period, which will trigger some warnings. Let's turn that off for this example
LogBox.ignoreLogs([`Setting a timer for a long period`]);

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
  const [loggdIn,setloggdIn]=useState(false)

  const auth = getAuth();

  const chkSigned = async ()=>{
    await onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        setloggdIn(true)
        setLoaded(false)
        // ...
      } else {
        console.log("로그인 안됨")
        setloggdIn(false)
        setLoaded(false)
      }
    })

  };

  useEffect(()=>{
    chkSigned();
  },[])

  if (loaded){
    return(
      <>
        <StatusBar></StatusBar>
        <View style={{flex:1,justifyContent:"center"}}>
          <Text>Loading...</Text>
      </View>
     </>
    )
  }

  // LoggIn이 되면 Main으로 들어가는데, 여기서는 tab navigator를 써서 이동가능하게함. 
  // 아래 페이지를 두고 안에서 이동가능하게 함.
  // LoggIn이 안되면 Lading page로 들어가서 Register 또는 Login 페이지로 이동가능함.
  return (loggdIn?
  <>
  <StatusBar></StatusBar>
  <Provider store={store}>
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen name="Main" component={Main} options={{headerShown:false}}></Stack.Screen>
          <Stack.Screen name="Add" component={Add}></Stack.Screen>
          <Stack.Screen name="Save" component={Save}></Stack.Screen>
          <Stack.Screen name="Comment" component={Comment}></Stack.Screen>
        </Stack.Navigator>
    </NavigationContainer>
  </Provider>
  </>:<>
  <StatusBar></StatusBar>
  <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen name="Lading" component={Landing} options={{headerShown:false}}></Stack.Screen>
        <Stack.Screen name="Register" component={Register} options={{headerShown:false}}></Stack.Screen>
        <Stack.Screen name="Login" component={Login} options={{headerShown:false}}></Stack.Screen>
      </Stack.Navigator>
  </NavigationContainer>
  </>

  );
}


