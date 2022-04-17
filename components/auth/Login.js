import { View, Text,TextInput,Button} from 'react-native';
import React,{useState,useEffect}from 'react';
import {
    getAuth,
    signInWithEmailAndPassword,
  } from "firebase/auth";

export default function Login() {
const [userInfo,setUserInfo]=useState({
    email:"",
    password:"",
    })

  const auth = getAuth();
  const SignIN=async()=>{
    console.log("로그인")
    const {email,password}=userInfo;
    await signInWithEmailAndPassword(auth,email,password).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    });

  }


  return (
<View style={{flex:1,justifyContent:"center"}}>
        <TextInput
            placeholder='email'
            onChangeText={(txt)=>{setUserInfo({...userInfo,email:txt})}}
        />
        <TextInput
            placeholder='password'
            secureTextEntry={true}
            onChangeText={(txt)=>{setUserInfo({...userInfo,password:txt})}}
        />
        <Button
            title="SignIn"
            onPress={()=>{SignIN()}}
        ></Button>

    </View>
  )
}