import { View, Text,TextInput,Button} from 'react-native';
import React,{useState,useEffect}from 'react';
import {
    getAuth,
    createUserWithEmailAndPassword,
  } from "firebase/auth";
  import { getFirestore, setDoc, doc } from 'firebase/firestore';

const Register = () => {
  const [userInfo,setUserInfo]=useState({
    email:"",
    password:"",
    name:""
  })

;

  const SignUp=async()=>{
    console.log("회원가입")
    const {email,password,name}=userInfo;
    // Firebase V9 문법이 많이 바뀜
    const auth =await  getAuth();
    const db = await getFirestore()
    // 회원가입을 진행한 후 collection에 추가함.
    await createUserWithEmailAndPassword(auth,email,password).then( async (result)=>{
        const userUID=result.user.uid
        //  console.log("result user : ",userUID)
          const docRef = await setDoc(doc(db, "users",userUID), {
            name,
            email
          });
    }).catch((error)=>{
        console.log(error)
    });

  }


  return (
    <View style={{flex:1,justifyContent:"center"}}>
        <TextInput
            placeholder='name'
            // 아래 처럼 prevState를 가져와서 처리함.
            onChangeText={(txt)=>{setUserInfo({...userInfo,name:txt})}}
        />
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
            title="Signup"
            onPress={()=>{SignUp()}}
        ></Button>

    </View>
  )
}

export default Register