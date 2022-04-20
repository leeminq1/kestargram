import React,{useState} from 'react'
import { View, Text, TextInput,Image,Button,StyleSheet,ActivityIndicator,TouchableOpacity} from 'react-native'
import { useRoute } from '@react-navigation/native';
import { getFirestore,collection,doc,addDoc,serverTimestamp  } from 'firebase/firestore';
import { getStorage,ref, uploadBytesResumable,getDownloadURL} from "firebase/storage";
import { getAuth } from "firebase/auth";

const Save = ({navigation}) => {
  
 const {params:{image:image_uri}} = useRoute();
 const [caption,setCaption]=useState("");
 const [saving,setSaving]=useState(false)


 const saveFireStore=async(uid,downloadURL)=>{
    // FireStorage에 업로드 후 FireStore에 저장
    // 구조는 posts/uid/userPosts/{downloadURL,caption.creation}의 형태로 저장함.
    const db = await getFirestore();
    // data 가져오기(db,collection이름,docID,subcollection_name)
    // data 저장하기 
    const docRef = await doc(db, "posts", uid);
    // setDoc 와 add 둘다 저장하는 코드인데, setDoc는 id를 설정하고 add는 자동으로 id생성함
    // 2중 구조에서 저장하기 방법. 아래는 위의 posts (collection) . doc(uid) . userPosts (collection) . doc(랜덤)
    // 의 구조안에 저장하는 형태
    const postRef = await addDoc(collection(docRef, "userPosts"), {
        downloadURL,
        caption,
        creation:serverTimestamp()
      }).then(()=>{
          console.log("userPost FireStore저장완료!")
        //  save가 있는 stackNavigator에서 가장 상위인 Main.js로 가서
        //  Main.js에 있는 bottomNavigator의 inti 값인 Feed.js로 감
          navigation.popToTop()
      }).catch((err)=>{ console.log("FiresotreErr",err)}).finally(()=>{setSaving(false)});
 }

 const uploadImage= async ()=>{
    setSaving(true)
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
          saveFireStore(uid,downloadURL);
        });
      }
    );
 }

  return (
    <View style={{flex:1,position:"relative",alignItems:"center"}}>
      {saving&&<View style={{width:"100%",height:"100%",position:"absolute",zIndex:99,alignSelf:"center",justifyContent:"center"}}>
            <ActivityIndicator color="purple" size={70}></ActivityIndicator>
          </View>}
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
      <TouchableOpacity
        style={{borderRadius:50,width:150,backgroundColor:"skyblue",paddingVertical:10,paddingHorizontal:10}}  
        // 여러번 클릭하는 것 방지하기 위해 saving 중이면 null 반환
        onPress={()=>{
          if(!saving){
            uploadImage();
          }
          console.log("저장중! 클릭방지!")
      }}>
          <Text style={{textAlign:"center",fontSize:20,color:"black",fontWeight:"bold"}}>Save Picture</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Save