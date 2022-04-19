import React,{useState} from 'react'
import { View, Text, TextInput,Image,Button,StyleSheet} from 'react-native'
import { useRoute } from '@react-navigation/native';
import { getFirestore,collection, getDoc ,doc } from 'firebase/firestore';
import { getStorage,ref, uploadBytesResumable,getDownloadURL} from "firebase/storage";
import { getAuth } from "firebase/auth";

const Save = () => {
  
 const {params:{image:image_uri}} = useRoute();
 const [caption,setCaption]=useState("");

 const uploadImage= async ()=>{
    const response=await fetch(image_uri);
    const blob=await response.blob();
    // uid 불러옴
    const auth = await getAuth();
    const {uid} = auth.currentUser;
    const imagePath=`post/${uid}/${Math.random().toString(36)}/`
    // firebase storage v9
    // 아래와 같은 형태로 이미지 저장
    // /images/currnet_user_uid/image_uri
    console.log("image_path",imagePath)
    const storage =await getStorage();
    const storageRef =await ref(storage, imagePath);
    // 'file' comes from the Blob or File API
    const uploadTask = uploadBytesResumable(storageRef, blob);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed',(snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        console.log("error 발생!!",error)
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
        });
      }
    );
 }

  return (
    <View style={{flex:1}}>
      <View style={{width:"100%",height:300}}>
        <Image style={StyleSheet.absoluteFill} source={{uri:image_uri}}></Image>
      </View>
      <TextInput
        style={{width:"100%",height:50}}
        placeholder='Write a Caption ... '
        onChangeText={(txt)=>{
            setCaption(txt)
        }}
      ></TextInput>
      <Button title='Save' onPress={()=>{
          uploadImage();
      }}></Button>
    </View>
  )
}

export default Save